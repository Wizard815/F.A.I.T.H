import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import server  # noqa: E402

# Two clearly different synthetic voices: a low male and a high female variant.
VOICES = {
    "low": ["-v", "en-us+m3", "-p", "25", "-s", "150"],
    "high": ["-v", "en-gb+f4", "-p", "85", "-s", "165"],
}
SENTENCES = [
    "The quick brown fox jumps over the lazy dog near the river bank this morning.",
    "Please remember to buy milk, bread and some fresh apples on the way home.",
    "We are going to visit grandma on Sunday afternoon if the weather is nice.",
    "Turn off the kitchen lights and lock the back door before you go to bed.",
]


def _espeak():
    return shutil.which("espeak-ng") or shutil.which("espeak")


@pytest.fixture(scope="session")
def embedder():
    return server.Embedder()


@pytest.fixture(scope="session")
def speak(tmp_path_factory):
    """speak(voice, text, fmt="wav") -> bytes of a synthetic speech clip."""
    exe = _espeak()
    if not exe:
        pytest.skip("espeak-ng is not installed: can't generate speech for model tests")
    if not shutil.which("ffmpeg"):
        pytest.skip("ffmpeg is not installed")
    out = tmp_path_factory.mktemp("speech")
    cache = {}

    def _speak(voice: str, text: str, fmt: str = "wav") -> bytes:
        key = (voice, text, fmt)
        if key in cache:
            return cache[key]
        wav = out / f"{len(cache)}.wav"
        subprocess.run([exe, *VOICES[voice], "-w", str(wav), text], check=True,
                       capture_output=True)
        if fmt == "wav":
            data = wav.read_bytes()
        else:
            dst = out / f"{len(cache)}.{fmt}"
            codec = ["-c:a", "libopus"] if fmt == "webm" else []
            subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", str(wav),
                            *codec, str(dst)], check=True)
            data = dst.read_bytes()
        cache[key] = data
        return data

    return _speak


def silence_wav(seconds: float = 3.0, rate: int = 16000) -> bytes:
    import io
    import wave

    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(b"\x00\x00" * int(seconds * rate))
    return buf.getvalue()


os.environ.setdefault("NUMBA_CACHE_DIR", str(Path(os.environ.get("TMPDIR", "/tmp")) / "voiceid-numba"))
