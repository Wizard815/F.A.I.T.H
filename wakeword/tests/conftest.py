import shutil
import subprocess
import sys
from pathlib import Path

import pytest

HERE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HERE))

RATE = 16000


def have_models() -> bool:
    return (HERE / "vosk-model" / "am").is_dir() and (HERE / "oww" / "melspectrogram.onnx").is_file()


needs_models = pytest.mark.skipif(not have_models(), reason="speech models not downloaded (see README: Run it without Docker)")


@pytest.fixture(scope="session")
def say():
    """Synthetic speech (espeak-ng) as 16 kHz mono 16-bit, after a second of silence."""
    if not shutil.which("espeak-ng"):
        pytest.skip("espeak-ng isn't installed")

    def make(text: str, voice: str = "en-us", speed: int = 140) -> bytes:
        wav = subprocess.run(["espeak-ng", "-v", voice, "-s", str(speed), "--stdout", text], capture_output=True, check=True).stdout
        pcm = subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-i", "-", "-ac", "1", "-ar", str(RATE), "-f", "s16le", "-"],
                             input=wav, capture_output=True, check=True).stdout
        return b"\0" * RATE * 2 + pcm + b"\0" * RATE * 2

    return make
