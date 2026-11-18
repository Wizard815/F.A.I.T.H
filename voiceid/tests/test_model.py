"""Exercise the real GE2E model with synthetic speech."""

import itertools

import numpy as np
import pytest

import server


def cos(a, b):
    a, b = np.asarray(a), np.asarray(b)
    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))


def test_Embed_SameVoiceIsCloserThanDifferentVoice(embedder, speak):
    from conftest import SENTENCES

    embs = {
        v: [embedder.embed_bytes(speak(v, s))["embedding"] for s in SENTENCES]
        for v in ("low", "high")
    }
    same = [cos(a, b) for v in embs for a, b in itertools.combinations(embs[v], 2)]
    diff = [cos(a, b) for a in embs["low"] for b in embs["high"]]
    print(f"\nsame voice: mean {np.mean(same):.3f} min {min(same):.3f}")
    print(f"different voice: mean {np.mean(diff):.3f} max {max(diff):.3f}")
    # Every same-voice pair beats every different-voice pair.
    assert min(same) > max(diff)
    assert np.mean(same) - np.mean(diff) > 0.1


def test_Embed_OutputShape(embedder, speak):
    out = embedder.embed_bytes(speak("low", "Hello, this is a short test of the voice service."))
    assert len(out["embedding"]) == server.EMBEDDING_DIM
    assert abs(np.linalg.norm(out["embedding"]) - 1.0) < 1e-5
    assert out["seconds"] > 1.0
    assert 1.0 <= out["speech_seconds"] <= out["seconds"] + 0.01


@pytest.mark.parametrize("fmt", ["webm", "ogg", "mp3", "m4a", "flac"])
def test_Embed_CompressedFormatsMatchWav(embedder, speak, fmt):
    from conftest import SENTENCES

    ref = embedder.embed_bytes(speak("high", SENTENCES[0]))["embedding"]
    other = embedder.embed_bytes(speak("high", SENTENCES[0], fmt))["embedding"]
    assert cos(ref, other) > 0.95


def test_Embed_SilenceIsRejected(embedder):
    from conftest import silence_wav

    with pytest.raises(server.AudioError, match="not enough speech"):
        embedder.embed_bytes(silence_wav())


def test_Embed_NoiseIsNotSpeech(embedder):
    import io
    import wave

    rng = np.random.default_rng(1)
    hum = (0.02 * np.sin(2 * np.pi * 50 * np.arange(48000) / 16000)).astype(np.float32)
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(16000)
        w.writeframes((hum * 32767 + rng.normal(0, 3, hum.size)).astype("<i2").tobytes())
    with pytest.raises(server.AudioError):
        embedder.embed_bytes(buf.getvalue())


def test_Decode_GarbageIsRejected():
    with pytest.raises(server.AudioError, match="could not decode"):
        server.decode_audio(b"this is definitely not audio" * 100)
    with pytest.raises(server.AudioError, match="empty"):
        server.decode_audio(b"")


def test_Decode_PlaylistIsRefused(tmp_path):
    # An HLS playlist would make ffmpeg open other files; the format whitelist refuses it.
    secret = tmp_path / "x.wav"
    from conftest import silence_wav

    secret.write_bytes(silence_wav(1))
    playlist = f"#EXTM3U\n#EXT-X-TARGETDURATION:1\n#EXTINF:1,\nfile://{secret}\n#EXT-X-ENDLIST\n"
    with pytest.raises(server.AudioError):
        server.decode_audio(playlist.encode())


def test_Decode_DeletesTempFile(tmp_path, monkeypatch, speak):
    import tempfile

    monkeypatch.setattr(tempfile, "tempdir", str(tmp_path))
    server.decode_audio(speak("low", "Nothing is kept on disk."))
    with pytest.raises(server.AudioError):
        server.decode_audio(b"garbage" * 10)
    assert list(tmp_path.iterdir()) == []


def test_Decode_ShortSpeechIsRejected(embedder, speak):
    with pytest.raises(server.AudioError, match="not enough speech"):
        embedder.embed_bytes(speak("low", "Hi."))
