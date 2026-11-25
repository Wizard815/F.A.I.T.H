"""Download the speech models the service needs, and check them.

    python fetch_models.py [folder]            # default: next to this file
    python fetch_models.py --example [folder]  # also openWakeWord's "hey jarvis" model (the tests use it)

- vosk-model: Vosk's small US English model (Apache 2.0, alphacephei.com), for any-phrase spotting.
- oww: openWakeWord's feature models (Apache 2.0), for trained wake word models.
"""

import hashlib
import io
import sys
import urllib.request
import zipfile
from pathlib import Path

VOSK = ("https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip", "30f26242c4eb449f948e42cb302dd7a686cb29a3423a8367f99ff41780942498")
OWW = "https://github.com/dscripka/openWakeWord/releases/download/v0.5.1/"
EXAMPLE = ("hey_jarvis_v0.1.onnx", "94a13cfe60075b132f6a472e7e462e8123ee70861bc3fb58434a73712ee0d2cb")
FEATURES = {
    "melspectrogram.onnx": "ba2b0e0f8b7b875369a2c89cb13360ff53bac436f2895cced9f479fa65eb176f",
    "embedding_model.onnx": "70d164290c1d095d1d4ee149bc5e00543250a7316b59f31d056cff7bd3075c1f",
}


def get(url: str, sha: str) -> bytes:
    data = urllib.request.urlopen(url, timeout=120).read()
    got = hashlib.sha256(data).hexdigest()
    if got != sha:
        raise SystemExit(f"{url} changed (sha256 {got}, expected {sha}). Not using it.")
    return data


def main(folder: Path, example: bool = False) -> None:
    vosk = folder / "vosk-model"
    if not (vosk / "am").is_dir():
        with zipfile.ZipFile(io.BytesIO(get(*VOSK))) as z:
            z.extractall(folder)
        (folder / "vosk-model-small-en-us-0.15").rename(vosk)
    oww = folder / "oww"
    oww.mkdir(exist_ok=True)
    for name, sha in FEATURES.items():
        if not (oww / name).is_file():
            (oww / name).write_bytes(get(OWW + name, sha))
    if example and not (oww / EXAMPLE[0]).is_file():
        (oww / EXAMPLE[0]).write_bytes(get(OWW + EXAMPLE[0], EXAMPLE[1]))
    print(f"models ready in {folder}")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--example"]
    main(Path(args[0]) if args else Path(__file__).resolve().parent, "--example" in sys.argv)
