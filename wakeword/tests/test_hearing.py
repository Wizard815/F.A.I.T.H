"""The service with the real models, on synthetic speech (espeak-ng). Real voices differ:
check yours with `python server.py --test`."""

import asyncio
from pathlib import Path

import pytest

import server
from conftest import HERE, needs_models

pytestmark = needs_models
OWW = HERE / "oww"


@pytest.fixture()
def lib(tmp_path: Path):
    models = tmp_path / "models"
    models.mkdir()
    if (OWW / "hey_jarvis_v0.1.onnx").is_file():
        (models / "hey_jarvis_v0.1.onnx").write_bytes((OWW / "hey_jarvis_v0.1.onnx").read_bytes())
    words = tmp_path / "wake_words.txt"
    words.write_text("hey faith\ncomputer\nhey jarvis = hey_jarvis_v0.1.onnx\n")
    return server.Library(words, HERE / "vosk-model", models, OWW, HERE / "common_en.txt", 0.9, 0.5)


def heard(lib, pcm: bytes, names=None):
    li, out = lib.listener(names), []
    for k in range(0, len(pcm), 2048):
        hit = li.feed(pcm[k : k + 2048])
        if hit:
            out.append(hit.phrase)
    return out


def test_any_phrase_and_a_trained_model_together(lib, say):
    if not (OWW / "hey_jarvis_v0.1.onnx").is_file():
        pytest.skip("hey_jarvis_v0.1.onnx not downloaded")
    assert heard(lib, say("hey faith, turn on the kitchen lights")) == ["hey faith"]
    assert heard(lib, say("computer, lights off")) == ["computer"]
    assert heard(lib, say("hey jarvis, turn on the lights")) == ["hey jarvis"]
    assert heard(lib, say("hey jarvis") + say("hey faith")) == ["hey jarvis", "hey faith"]


def test_other_speech_isnt_a_wake(lib, say):
    for text in ["safe and sound", "the weather today is nice and sunny", "hey fate", "hey travis", "okay, that's fine"]:
        assert heard(lib, say(text)) == [], text


def test_only_the_words_asked_for(lib, say):
    assert heard(lib, say("hey faith"), ["computer"]) == []
    assert heard(lib, say("hey faith"), ["hey_faith"]) == ["hey faith"]
    assert heard(lib, say("hey faith"), ["any"]) == ["hey faith"]


def test_a_new_word_works_without_a_restart(lib, say, tmp_path):
    assert heard(lib, say("hello computer")) == []
    lib.words_file.write_text("hello computer\n")
    import os, time
    os.utime(lib.words_file, (time.time() + 5, time.time() + 5))
    assert heard(lib, say("hello computer")) == ["hello computer"]


def test_unknown_words_are_reported(lib, tmp_path):
    lib.words_file.write_text("hey zorblax\nhey faith\n")
    import os, time
    os.utime(lib.words_file, (time.time() + 10, time.time() + 10))
    lib.reload()
    assert [w.phrase for w in lib.words] == ["hey faith"]
    assert any("'zorblax' isn't a word the speech model knows" in p for p in lib.problems)


def test_wyoming_like_home_assistant(lib, say):
    """Describe, then Detect + audio, the way HA's wyoming integration does."""
    from wyoming.audio import AudioChunk, AudioStart, AudioStop
    from wyoming.client import AsyncTcpClient
    from wyoming.info import Describe, Info
    from wyoming.server import AsyncServer
    from wyoming.wake import Detect, Detection, NotDetected
    from functools import partial

    async def run():
        srv = AsyncServer.from_uri("tcp://127.0.0.1:0")
        task = asyncio.create_task(srv.run(partial(server.handler_class(), lib)))
        for _ in range(50):
            if getattr(srv, "_server", None) and srv._server.sockets:
                break
            await asyncio.sleep(0.05)
        port = srv._server.sockets[0].getsockname()[1]

        async def stream(names, pcm):
            async with AsyncTcpClient("127.0.0.1", port) as c:
                await c.write_event(Detect(names=names).event())
                await c.write_event(AudioStart(rate=16000, width=2, channels=1).event())
                for k in range(0, len(pcm), 2048):
                    await c.write_event(AudioChunk(rate=16000, width=2, channels=1, audio=pcm[k : k + 2048], timestamp=k // 32).event())
                await c.write_event(AudioStop().event())
                while True:
                    e = await asyncio.wait_for(c.read_event(), 20)
                    if Detection.is_type(e.type):
                        return Detection.from_event(e).name
                    if NotDetected.is_type(e.type):
                        return None

        async with AsyncTcpClient("127.0.0.1", port) as c:
            await c.write_event(Describe().event())
            info = Info.from_event(await asyncio.wait_for(c.read_event(), 10))
        names = [m.name for m in info.wake[0].models]
        try:
            return names, await stream(["hey_faith"], say("hey faith")), await stream(["any"], say("computer, lights off")), await stream(["hey_faith"], say("safe and sound"))
        finally:
            task.cancel()

    names, a, b, c = asyncio.run(run())
    assert names == ["hey_faith", "computer", "hey_jarvis", "any"]
    assert a == "hey_faith"
    assert b == "any", "asked for any: answered as any, or HA would skip it"
    assert c is None
