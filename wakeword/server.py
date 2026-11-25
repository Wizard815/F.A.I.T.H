"""wakeword: FAITH's wake words for Home Assistant's voice pipeline (Wyoming).

Any phrase in the wake words file is a wake word, and there can be many.
Each is offered to Home Assistant on its own, plus "any", which listens
for all of them at once.

    python server.py                  # serve (Wyoming, tcp://0.0.0.0:10400)
    python server.py --check          # list the wake words and say what's wrong
    python server.py --test clip.wav  # which wake word a recording sets off, and when
"""

from __future__ import annotations

import argparse
import asyncio
import logging
import os
import subprocess
import sys
import time
from functools import partial
from pathlib import Path

from engines import RATE, Features, Spotter, TrainedStream, Word, missing_words, parse_words

log = logging.getLogger("wakeword")
HERE = Path(__file__).resolve().parent
VERSION = "1.0.0"
ANY = "any"


def env(name: str, default: str) -> str:
    return os.environ.get(name, default)


class Library:
    """The wake words file, the speech model and the trained models. The file is read
    again when it changes, so a new wake word works on the next stream."""

    def __init__(self, words_file: Path, vosk_dir: Path, models_dir: Path, features_dir: Path, common_file: Path,
                 min_confidence: float, threshold: float, fallback: str = ""):
        self.words_file, self.vosk_dir, self.models_dir, self.features_dir = words_file, vosk_dir, models_dir, features_dir
        self.min_confidence, self.threshold, self.fallback = min_confidence, threshold, fallback
        self.common = [w for line in common_file.read_text().splitlines() if not line.startswith("#") for w in line.split()]
        self._vosk = None
        self._features: Features | None = None
        self._trained: dict[str, tuple] = {}
        self._mtime = -1.0
        self.words: list[Word] = []
        self.problems: list[str] = []
        self.reload()

    @property
    def vosk(self):
        if self._vosk is None:
            import vosk

            vosk.SetLogLevel(-1)
            self._vosk = vosk.Model(str(self.vosk_dir))
        return self._vosk

    def reload(self) -> None:
        mtime = self.words_file.stat().st_mtime if self.words_file.exists() else 0.0
        if mtime == self._mtime:
            return
        self._mtime = mtime
        text = self.words_file.read_text() if self.words_file.exists() else self.fallback.replace(";", "\n").replace(",", "\n")
        words, problems = parse_words(text)
        ok: list[Word] = []
        for w in words:
            if w.model:
                path = self.models_dir / w.model
                if not path.is_file():
                    problems.append(f"{w.phrase!r}: no model file {path}. Put the .onnx file there, or remove `= {w.model}` to use it as a plain phrase.")
                    continue
                if not path.suffix == ".onnx":
                    problems.append(f"{w.phrase!r}: {w.model} isn't an .onnx model (openWakeWord's .onnx export).")
                    continue
            ok.append(w)
        if any(w.model is None for w in ok):
            for word in missing_words(self.vosk, ok):
                problems.append(f"{word!r} isn't a word the speech model knows, so phrases with it can't be heard. Spell it as words it knows (\"jar vis\"), or train a model for it.")
            bad = {p for p in missing_words(self.vosk, ok)}
            ok = [w for w in ok if w.model or not (set(w.phrase.split()) & bad)]
        if not ok:
            problems.append("No wake words. Add one per line to the wake words file (for example: hey faith).")
        self.words, self.problems = ok, problems
        for p in problems:
            log.warning("wake words: %s", p)
        log.info("wake words: %s", ", ".join(f"{w.phrase}{' (trained)' if w.model else ''}" for w in ok) or "none")

    def features(self) -> Features:
        if self._features is None:
            self._features = Features(self.features_dir)
        return self._features

    def trained(self, w: Word):
        key = str(self.models_dir / w.model)
        if key not in self._trained:
            self._trained[key] = self.features().model(self.models_dir / w.model)
        return self._trained[key]

    def listener(self, names: list[str] | None) -> "Listener":
        self.reload()
        if not names or ANY in names:
            chosen = self.words
        else:
            chosen = [w for w in self.words if w.name in names]
        return Listener(self, chosen)


class Listener:
    """One audio stream: the spotter for plain phrases, the trained models for the rest."""

    QUIET_AFTER_MS = 2000  # one "hey faith" is one wake

    def __init__(self, lib: Library, words: list[Word]):
        self.words = words
        plain = [w for w in words if w.model is None]
        trained = [w for w in words if w.model]
        self.spotter = Spotter(lib.vosk, plain, lib.common, lib.min_confidence) if plain else None
        self.trained = TrainedStream(lib.features(), [(w, *lib.trained(w)) for w in trained], lib.threshold) if trained else None
        self.heard_ms = 0.0
        self.quiet_until = 0.0

    def feed(self, pcm: bytes) -> Word | None:
        self.heard_ms += len(pcm) / (RATE * 2) * 1000
        hits = [e.feed(pcm) for e in (self.spotter, self.trained) if e]
        hit = next((h for h in hits if h), None)
        if hit and self.heard_ms >= self.quiet_until:
            self.quiet_until = self.heard_ms + self.QUIET_AFTER_MS
            return hit
        return None


# ---------------------------------------------------------------- Wyoming


def info(lib: Library):
    from wyoming.info import Attribution, Info, WakeModel, WakeProgram

    ours = Attribution(name="FAITH", url="https://github.com/Wizard815/F.A.I.T.H")
    lib.reload()
    models = [WakeModel(name=w.name, phrase=w.phrase, description=w.phrase.title() + (" (trained)" if w.model else ""),
                        attribution=ours, installed=True, version=VERSION, languages=["en"]) for w in lib.words]
    if len(lib.words) > 1:
        models.append(WakeModel(name=ANY, phrase=" / ".join(w.phrase for w in lib.words), description="Any of FAITH's wake words",
                                attribution=ours, installed=True, version=VERSION, languages=["en"]))
    return Info(wake=[WakeProgram(name="faith-wake", description="FAITH's wake words: any phrase, as many as you like",
                                  attribution=ours, installed=True, version=VERSION, models=models)])


def handler_class():
    from wyoming.audio import AudioChunk, AudioChunkConverter, AudioStart, AudioStop
    from wyoming.event import Event
    from wyoming.info import Describe
    from wyoming.server import AsyncEventHandler
    from wyoming.wake import Detect, Detection, NotDetected

    class Handler(AsyncEventHandler):
        def __init__(self, lib: Library, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.lib = lib
            self.names: list[str] | None = None
            self.listener: Listener | None = None
            self.detected = False
            self.convert = AudioChunkConverter(rate=RATE, width=2, channels=1)

        async def handle_event(self, event: Event) -> bool:
            if Describe.is_type(event.type):
                await self.write_event(info(self.lib).event())
            elif Detect.is_type(event.type):
                self.names = Detect.from_event(event).names
                self.listener = None
            elif AudioStart.is_type(event.type):
                self.listener, self.detected = None, False
            elif AudioChunk.is_type(event.type):
                if self.listener is None:
                    self.listener = await asyncio.to_thread(self.lib.listener, self.names)
                chunk = self.convert.convert(AudioChunk.from_event(event))
                hit = await asyncio.to_thread(self.listener.feed, chunk.audio)
                if hit:
                    self.detected = True
                    # Answer with the name that was asked for: HA skips a detection with another name.
                    # Asked for "any": it's "any" (the log says which phrase it was).
                    name = hit.name if not self.names or hit.name in self.names else (ANY if ANY in self.names else self.names[0])
                    log.info("heard %r", hit.phrase)
                    await self.write_event(Detection(name=name, timestamp=chunk.timestamp).event())
            elif AudioStop.is_type(event.type):
                if not self.detected:
                    await self.write_event(NotDetected().event())
                self.listener = None
            return True

    return Handler


async def serve(lib: Library, uri: str) -> None:
    from wyoming.server import AsyncServer

    server = AsyncServer.from_uri(uri)
    log.info("listening on %s", uri)
    await server.run(partial(handler_class(), lib))


# ---------------------------------------------------------------- command line


def pcm_of(path: Path) -> bytes:
    """Any recording ffmpeg reads, as 16 kHz mono 16-bit."""
    out = subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-i", str(path), "-ac", "1", "-ar", str(RATE), "-f", "s16le", "-"],
                         capture_output=True, check=False)
    if out.returncode != 0 or not out.stdout:
        raise SystemExit(f"Couldn't read {path}: {out.stderr.decode(errors='replace').strip() or 'no audio'}")
    return out.stdout


def test_file(lib: Library, path: Path) -> list[tuple[float, str]]:
    pcm = pcm_of(path) + b"\0" * RATE  # a second of silence at the end, like a pause
    listener, step, found = lib.listener(None), 2048, []
    for k in range(0, len(pcm), step):
        hit = listener.feed(pcm[k : k + step])
        if hit:
            found.append((round((k + step) / (RATE * 2), 2), hit.phrase))
    return found


def library_from_env() -> Library:
    return Library(
        words_file=Path(env("WAKE_WORDS_FILE", "/config/wake_words.txt")),
        vosk_dir=Path(env("WAKE_VOSK_MODEL", str(HERE / "vosk-model"))),
        models_dir=Path(env("WAKE_MODELS", "/config/models")),
        features_dir=Path(env("WAKE_FEATURES", str(HERE / "oww"))),
        common_file=Path(env("WAKE_COMMON_WORDS", str(HERE / "common_en.txt"))),
        min_confidence=float(env("WAKE_MIN_CONFIDENCE", "0.9")),
        threshold=float(env("WAKE_THRESHOLD", "0.5")),
        fallback=env("WAKE_WORDS", "hey faith"),
    )


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--check", action="store_true", help="list the wake words and what's wrong with them")
    ap.add_argument("--test", type=Path, metavar="RECORDING", help="which wake words a recording sets off, and when")
    a = ap.parse_args(argv)
    logging.basicConfig(level=env("WAKE_LOG_LEVEL", "INFO"), format="%(asctime)s %(levelname)s %(message)s")
    if a.check:
        logging.getLogger("wakeword").setLevel(logging.ERROR)
    words_file = Path(env("WAKE_WORDS_FILE", "/config/wake_words.txt"))
    if not words_file.exists() and not os.environ.get("WAKE_WORDS"):
        # First start: a wake words file to edit, with "hey faith" in it.
        try:
            words_file.parent.mkdir(parents=True, exist_ok=True)
            words_file.write_text((HERE / "wake_words.example.txt").read_text())
            log.info("wrote %s: edit it to change the wake words", words_file)
        except OSError:
            pass
    lib = library_from_env()
    if a.check:
        for w in lib.words:
            how = f"trained model {w.model}" if w.model else "any-phrase spotting"
            print(f"  {w.phrase:<24} id {w.name:<20} {how}" + (f", level {w.level}" if w.level else ""))
        for p in lib.problems:
            print(f"  problem: {p}")
        return 1 if lib.problems else 0
    if a.test:
        t0 = time.monotonic()
        found = test_file(lib, a.test)
        for at, phrase in found:
            print(f"  {at:6.2f} s  {phrase}")
        print(f"  {len(found)} wake{'s' if len(found) != 1 else ''} in {a.test.name} ({time.monotonic() - t0:.1f} s to check)")
        return 0
    asyncio.run(serve(lib, env("WAKE_URI", "tcp://0.0.0.0:10400")))
    return 0


if __name__ == "__main__":
    sys.exit(main())
