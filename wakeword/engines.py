"""The two ways a wake word is heard.

- Spotter (any phrase, no training): Vosk speech recognition limited to the
  wake phrases plus a few hundred everyday words. Other speech lands on the
  everyday words, so it doesn't trigger. A phrase counts only when it starts
  what was said and every word of it is heard with enough confidence.
- Trained (better at telling one phrase apart): an openWakeWord model
  (.onnx) run with onnxruntime: audio -> mel spectrogram -> embeddings ->
  the phrase's own model, which gives a score from 0 to 1.

Both read 16 kHz mono 16-bit audio.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path

import numpy as np

RATE = 16000


@dataclass
class Word:
    phrase: str            # what to say, lowercase words: "hey faith"
    name: str              # its id for Home Assistant: "hey_faith"
    model: str | None      # a trained model file, or None for the spotter
    level: float | None    # this word's own confidence (spotter) or score (trained) to count


LINE = re.compile(r"^(?P<phrase>[^=@#]+?)\s*(?:=\s*(?P<model>[^@#\s]+))?\s*(?:@\s*(?P<level>[0-9.]+))?\s*(?:#.*)?$")


def slug(phrase: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", phrase.lower()).strip("_") or "wake"


def parse_words(text: str) -> tuple[list[Word], list[str]]:
    """The wake words file: one per line, `phrase`, `phrase = model.onnx`, and an optional `@ level`."""
    words: list[Word] = []
    problems: list[str] = []
    for n, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        m = LINE.match(line)
        if not m:
            problems.append(f"line {n}: can't read {line!r}. Write a phrase, optionally `= model.onnx` and `@ 0.9`.")
            continue
        phrase = " ".join(re.sub(r"[^\w' ]+", " ", m["phrase"].lower()).split())
        if not phrase:
            problems.append(f"line {n}: no words in {line!r}.")
            continue
        level = float(m["level"]) if m["level"] else None
        if level is not None and not 0 < level <= 1:
            problems.append(f"line {n}: {m['level']} isn't between 0 and 1.")
            level = None
        name = slug(phrase)
        if any(w.name == name for w in words):
            problems.append(f"line {n}: {phrase!r} is already a wake word.")
            continue
        words.append(Word(phrase, name, m["model"], level))
    return words, problems


# ---------------------------------------------------------------- spotter


class Spotter:
    """Vosk, limited to the wake phrases and everyday words."""

    SETTLE_MS = 300  # a phrase that stays the same this long is checked without waiting for silence

    def __init__(self, model, words: list[Word], common: list[str], min_confidence: float):
        from vosk import KaldiRecognizer

        self.words = [w for w in words if w.model is None]
        self.min_confidence = min_confidence
        parts = sorted({p for w in self.words for p in w.phrase.split()})
        grammar = [w.phrase for w in self.words] + parts + [c for c in common if c not in parts] + ["[unk]"]
        self.rec = KaldiRecognizer(model, RATE, json.dumps(grammar))
        self.rec.SetWords(True)
        self.last = ""
        self.stable_ms = 0.0

    def _check(self, result: dict) -> Word | None:
        heard = [w for w in result.get("result", [])]
        # Noise before the phrase is fine; other words before it are not ("the computer is broken").
        while heard and heard[0]["word"] == "[unk]":
            heard.pop(0)
        said = [w["word"] for w in heard]
        for w in sorted(self.words, key=lambda x: -len(x.phrase.split())):
            parts = w.phrase.split()
            if said[: len(parts)] == parts:
                need = w.level if w.level is not None else self.min_confidence
                if min(h["conf"] for h in heard[: len(parts)]) >= need:
                    return w
        return None

    def feed(self, pcm: bytes) -> Word | None:
        if not self.words:
            return None
        if self.rec.AcceptWaveform(pcm):
            self.last, self.stable_ms = "", 0.0
            return self._check(json.loads(self.rec.Result()))
        partial = json.loads(self.rec.PartialResult()).get("partial", "")
        self.stable_ms = self.stable_ms + len(pcm) / (RATE * 2) * 1000 if partial == self.last else 0.0
        self.last = partial
        lead = partial.replace("[unk]", " ").split()
        if self.stable_ms >= self.SETTLE_MS and any(lead[: len(w.phrase.split())] == w.phrase.split() for w in self.words):
            # Don't wait for a pause: "hey faith turn on the lights" in one breath.
            hit = self._check(json.loads(self.rec.FinalResult()))
            self.rec.Reset()
            self.last, self.stable_ms = "", 0.0
            return hit
        return None


def missing_words(model, words: list[Word]) -> list[str]:
    """Words of spotter phrases the speech model doesn't know (they'd be ignored)."""
    out = []
    for w in words:
        if w.model is None:
            out += [p for p in w.phrase.split() if model.vosk_model_find_word(p) < 0 and p not in out]
    return out


# ---------------------------------------------------------------- trained (openWakeWord)


class Features:
    """openWakeWord's shared feature models (mel spectrogram and speech embedding)."""

    FRAME = 1280  # 80 ms

    def __init__(self, folder: Path):
        import onnxruntime as ort

        opts = ort.SessionOptions()
        opts.inter_op_num_threads = 1
        opts.intra_op_num_threads = 1
        self.ort, self.opts = ort, opts
        self.mel = ort.InferenceSession(str(folder / "melspectrogram.onnx"), opts, providers=["CPUExecutionProvider"])
        self.emb = ort.InferenceSession(str(folder / "embedding_model.onnx"), opts, providers=["CPUExecutionProvider"])
        self.mel_in = self.mel.get_inputs()[0].name
        self.emb_in = self.emb.get_inputs()[0].name
        # Like openWakeWord: start from features of quiet noise, not zeros.
        rng = np.random.default_rng(0)
        s = TrainedStream(self, [])
        s.feed(rng.integers(-1000, 1000, RATE * 4).astype(np.int16).tobytes())
        self.start_mel, self.start_emb = s.mel.copy(), s.emb.copy()

    def model(self, path: Path):
        sess = self.ort.InferenceSession(str(path), self.opts, providers=["CPUExecutionProvider"])
        frames = sess.get_inputs()[0].shape[1]
        return sess, sess.get_inputs()[0].name, int(frames if isinstance(frames, int) else 16)

    def melspec(self, audio: np.ndarray) -> np.ndarray:
        out = self.mel.run(None, {self.mel_in: audio.astype(np.float32)[None, :]})[0]
        return np.squeeze(out) / 10 + 2

    def embed(self, mel76: np.ndarray) -> np.ndarray:
        return np.squeeze(self.emb.run(None, {self.emb_in: mel76.astype(np.float32)[None, :, :, None]})[0])


class TrainedStream:
    """One audio stream through the feature models and each trained wake model."""

    def __init__(self, f: Features, models: list[tuple[Word, object, str, int]], threshold: float = 0.5):
        self.f, self.models, self.threshold = f, models, threshold
        self.pending = np.zeros(0, dtype=np.int16)
        self.tail = np.zeros(0, dtype=np.int16)
        self.mel = getattr(f, "start_mel", np.ones((76, 32), dtype=np.float32)).copy()
        self.emb = getattr(f, "start_emb", np.zeros((16, 96), dtype=np.float32)).copy()
        self.frames = 0

    def feed(self, pcm: bytes) -> Word | None:
        self.pending = np.concatenate([self.pending, np.frombuffer(pcm, dtype=np.int16)])
        hit = None
        while len(self.pending) >= Features.FRAME:
            frame, self.pending = self.pending[: Features.FRAME], self.pending[Features.FRAME :]
            self.tail = np.concatenate([self.tail, frame])[-(Features.FRAME + 160 * 3) :]
            self.mel = np.vstack([self.mel, self.f.melspec(self.tail)])[-200:]
            self.emb = np.vstack([self.emb, self.f.embed(self.mel[-76:])])[-120:]
            self.frames += 1
            if self.frames < 5 or hit:  # openWakeWord ignores the first few frames
                continue
            for word, sess, name, n in self.models:
                score = float(np.squeeze(sess.run(None, {name: self.emb[-n:].astype(np.float32)[None, :, :]})[0]))
                if score >= (word.level if word.level is not None else self.threshold):
                    hit = word
                    break
        return hit
