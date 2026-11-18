"""voiceid: turn a short audio clip into a speaker embedding.

FAITH sends audio, gets a 256-float L2-normalised vector back, and does the
matching itself. This service keeps nothing: audio lives in memory and in one
temp file that is deleted as soon as ffmpeg has decoded it.
"""

from __future__ import annotations

import hmac
import json
import logging
import math
import os
import subprocess
import tempfile
import threading
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import numpy as np

SAMPLE_RATE = 16000
MAX_BODY_BYTES = 15 * 1024 * 1024
MODEL_NAME = "resemblyzer-ge2e-0.1.4"
EMBEDDING_DIM = 256

# Only plain audio containers. This keeps ffmpeg away from playlists (HLS,
# concat) that could make it open other files or URLs.
FFMPEG_FORMATS = "wav,mp3,ogg,matroska,webm,mov,mp4,m4a,3gp,3g2,mj2,flac,aac,aiff,caf"
ACCEPTED_TYPES = ("audio/", "video/webm", "video/ogg", "video/mp4", "application/octet-stream")

log = logging.getLogger("voiceid")


class AudioError(ValueError):
    """The audio can't be used. The message is safe to return to the caller."""


def _env_float(name: str, default: float) -> float:
    raw = os.environ.get(name, "").strip()
    return float(raw) if raw else default


def decode_audio(data: bytes, max_seconds: float = 120.0, timeout: float = 30.0) -> np.ndarray:
    """Decode any common audio format to 16 kHz mono float32 with ffmpeg."""
    if not data:
        raise AudioError("empty body")
    fd, path = tempfile.mkstemp(prefix="voiceid-")  # mode 0600
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(data)
        cmd = [
            "ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error",
            "-protocol_whitelist", "file,pipe",
            "-format_whitelist", FFMPEG_FORMATS,
            "-i", path,
            "-vn", "-ac", "1", "-ar", str(SAMPLE_RATE),
            "-t", str(max_seconds),
            "-f", "f32le", "pipe:1",
        ]
        try:
            proc = subprocess.run(cmd, capture_output=True, timeout=timeout, check=False)
        except subprocess.TimeoutExpired as e:
            raise AudioError("decoding took too long") from e
    finally:
        try:
            os.unlink(path)
        except FileNotFoundError:
            pass
    if proc.returncode != 0 or not proc.stdout:
        raise AudioError("could not decode audio")
    usable = len(proc.stdout) - len(proc.stdout) % 4
    wav = np.frombuffer(proc.stdout[:usable], dtype="<f4").astype(np.float32)
    if wav.size == 0 or not np.all(np.isfinite(wav)):
        raise AudioError("could not decode audio")
    return np.clip(wav, -1.0, 1.0)


class Embedder:
    """Loads the GE2E encoder once and embeds decoded audio."""

    def __init__(self, min_speech_seconds: float = 1.0, max_seconds: float = 120.0,
                 concurrency: int = 2):
        # Imported here so tests of the HTTP layer stay cheap to import.
        import torch
        from resemblyzer import VoiceEncoder

        threads = int(os.environ.get("VOICEID_TORCH_THREADS", "0") or 0)
        if threads > 0:
            torch.set_num_threads(threads)
        self.encoder = VoiceEncoder("cpu", verbose=False)
        self.min_speech_seconds = min_speech_seconds
        self.max_seconds = max_seconds
        self._slots = threading.BoundedSemaphore(max(1, concurrency))

    def embed_wav(self, wav: np.ndarray) -> dict:
        from resemblyzer import preprocess_wav

        seconds = len(wav) / SAMPLE_RATE
        # Digital silence makes resemblyzer's volume normalisation divide by
        # zero, so catch it first.
        if wav.size == 0 or float(np.sqrt(np.mean(np.square(wav)))) < 1e-4:
            speech = np.zeros(0, dtype=np.float32)
        else:
            # Normalises volume, then keeps only the voiced parts (webrtcvad).
            speech = preprocess_wav(wav)
        speech_seconds = len(speech) / SAMPLE_RATE
        if speech_seconds < self.min_speech_seconds:
            raise AudioError(
                f"not enough speech: {speech_seconds:.2f}s, need {self.min_speech_seconds:.1f}s"
            )
        with self._slots:
            emb = self.encoder.embed_utterance(speech)
        emb = np.asarray(emb, dtype=np.float64)
        norm = float(np.linalg.norm(emb))
        if not math.isfinite(norm) or norm == 0.0:
            raise AudioError("could not compute an embedding")
        emb = emb / norm
        return {
            "embedding": [round(float(x), 7) for x in emb],
            "seconds": round(seconds, 3),
            "speech_seconds": round(speech_seconds, 3),
        }

    def embed_bytes(self, data: bytes) -> dict:
        return self.embed_wav(decode_audio(data, max_seconds=self.max_seconds))


def make_handler(embedder: Embedder, token: str | None):
    token_bytes = token.encode() if token else None

    class Handler(BaseHTTPRequestHandler):
        server_version = "voiceid"
        sys_version = ""
        protocol_version = "HTTP/1.1"
        timeout = 60  # seconds per socket read; stops slow uploads hanging a thread

        def log_message(self, fmt, *args):  # never logs bodies
            log.info("%s %s", self.address_string(), fmt % args)

        def _send(self, status: int, body: dict, close: bool = False):
            raw = json.dumps(body, separators=(",", ":")).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(raw)))
            self.send_header("Cache-Control", "no-store")
            if close:
                self.send_header("Connection", "close")
                self.close_connection = True
            self.end_headers()
            self.wfile.write(raw)

        def _authorised(self) -> bool:
            if token_bytes is None:
                return True
            header = self.headers.get("Authorization", "")
            scheme, _, given = header.partition(" ")
            ok = hmac.compare_digest(given.strip().encode(), token_bytes)
            return ok and scheme.lower() == "bearer"

        def do_GET(self):
            if self.path.split("?", 1)[0] == "/health":
                self._send(200, {"ok": True, "model": MODEL_NAME, "dim": EMBEDDING_DIM})
            else:
                self._send(404, {"error": "not found"})

        def do_POST(self):
            if self.path.split("?", 1)[0] != "/embed":
                self._send(404, {"error": "not found"}, close=True)
                return
            if not self._authorised():
                self._send(401, {"error": "unauthorised"}, close=True)
                return
            if self.headers.get("Transfer-Encoding"):
                self._send(411, {"error": "send Content-Length, not chunked"}, close=True)
                return
            try:
                length = int(self.headers.get("Content-Length", ""))
            except ValueError:
                self._send(411, {"error": "Content-Length required"}, close=True)
                return
            if length < 0:
                self._send(400, {"error": "bad Content-Length"}, close=True)
                return
            if length > MAX_BODY_BYTES:
                self._send(413, {"error": f"body over {MAX_BODY_BYTES} bytes"}, close=True)
                return
            ctype = (self.headers.get("Content-Type") or "").split(";", 1)[0].strip().lower()
            if ctype and not ctype.startswith(ACCEPTED_TYPES):
                self._send(415, {"error": "send audio (Content-Type audio/*)"}, close=True)
                return
            data = self.rfile.read(length) if length else b""
            if len(data) != length:
                self._send(400, {"error": "body shorter than Content-Length"}, close=True)
                return
            try:
                result = embedder.embed_bytes(data)
            except AudioError as e:
                self._send(400, {"error": str(e)})
                return
            except Exception:  # noqa: BLE001 - never leak internals
                log.exception("embedding failed")
                self._send(500, {"error": "internal error"})
                return
            finally:
                del data
            self._send(200, result)

    return Handler


def make_server(host: str = "0.0.0.0", port: int = 8099, token: str | None = None,
                embedder: Embedder | None = None) -> ThreadingHTTPServer:
    if embedder is None:
        embedder = Embedder(
            min_speech_seconds=_env_float("VOICEID_MIN_SPEECH_SECONDS", 1.0),
            max_seconds=_env_float("VOICEID_MAX_SECONDS", 120.0),
            concurrency=int(os.environ.get("VOICEID_CONCURRENCY", "2") or 2),
        )
    httpd = ThreadingHTTPServer((host, port), make_handler(embedder, token or None))
    httpd.daemon_threads = True
    return httpd


def main():
    logging.basicConfig(level=os.environ.get("VOICEID_LOG_LEVEL", "INFO"),
                        format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    host = os.environ.get("VOICEID_HOST", "0.0.0.0")
    port = int(os.environ.get("VOICEID_PORT", "8099"))
    token = os.environ.get("VOICEID_TOKEN") or None
    httpd = make_server(host, port, token)
    log.info("listening on %s:%d (auth %s)", host, port, "on" if token else "off")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
