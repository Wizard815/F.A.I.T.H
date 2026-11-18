"""HTTP API tests against a real server on a random port."""

import http.client
import json
import socket
import threading

import numpy as np
import pytest

import server
from conftest import SENTENCES, silence_wav


def _start(embedder, token=None):
    httpd = server.make_server("127.0.0.1", 0, token=token, embedder=embedder)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


@pytest.fixture(scope="module")
def open_srv(embedder):
    httpd = _start(embedder)
    yield httpd.server_address[1]
    httpd.shutdown()
    httpd.server_close()


@pytest.fixture(scope="module")
def auth_srv(embedder):
    httpd = _start(embedder, token="s3cret-token")
    yield httpd.server_address[1]
    httpd.shutdown()
    httpd.server_close()


def call(port, method, path, body=None, headers=None):
    conn = http.client.HTTPConnection("127.0.0.1", port, timeout=60)
    h = {"Content-Type": "audio/wav", **(headers or {})}
    conn.request(method, path, body=body, headers=h)
    resp = conn.getresponse()
    data = json.loads(resp.read() or b"null")
    conn.close()
    return resp.status, data


def test_Api_Health(open_srv):
    status, body = call(open_srv, "GET", "/health")
    assert status == 200
    assert body == {"ok": True, "model": server.MODEL_NAME, "dim": 256}


def test_Api_Embed(open_srv, speak):
    status, body = call(open_srv, "POST", "/embed", speak("low", SENTENCES[1]))
    assert status == 200, body
    assert set(body) == {"embedding", "seconds", "speech_seconds"}
    assert len(body["embedding"]) == 256
    assert abs(np.linalg.norm(body["embedding"]) - 1) < 1e-5
    assert body["speech_seconds"] >= 1.0


def test_Api_EmbedWebm(open_srv, speak):
    status, body = call(open_srv, "POST", "/embed", speak("high", SENTENCES[2], "webm"),
                        {"Content-Type": "audio/webm;codecs=opus"})
    assert status == 200, body
    assert len(body["embedding"]) == 256


@pytest.mark.parametrize("payload,needle", [
    (b"", "empty"),
    (b"\x00\x01garbage" * 500, "decode"),
    (None, "speech"),  # silence
])
def test_Api_BadAudioIs400(open_srv, payload, needle):
    body = silence_wav() if payload is None else payload
    status, resp = call(open_srv, "POST", "/embed", body)
    assert status == 400
    assert needle in resp["error"]


def test_Api_ShortSpeechIs400(open_srv, speak):
    status, resp = call(open_srv, "POST", "/embed", speak("low", "Hi."))
    assert status == 400
    assert "speech" in resp["error"]


def test_Api_TooLargeIs413WithoutReadingBody(open_srv):
    with socket.create_connection(("127.0.0.1", open_srv), timeout=10) as s:
        s.sendall(b"POST /embed HTTP/1.1\r\nHost: x\r\nContent-Type: audio/wav\r\n"
                  b"Content-Length: %d\r\n\r\n" % (15 * 1024 * 1024 + 1))
        head = s.recv(4096).decode()
    assert head.startswith("HTTP/1.1 413")


def test_Api_WrongContentTypeIs415(open_srv):
    status, _ = call(open_srv, "POST", "/embed", b"{}", {"Content-Type": "application/json"})
    assert status == 415


def test_Api_UnknownPathIs404(open_srv):
    assert call(open_srv, "GET", "/nope")[0] == 404
    assert call(open_srv, "POST", "/nope", b"x")[0] == 404


def test_Api_AuthRequiredWhenTokenSet(auth_srv, speak):
    clip = speak("low", SENTENCES[0])
    assert call(auth_srv, "POST", "/embed", clip)[0] == 401
    assert call(auth_srv, "POST", "/embed", clip, {"Authorization": "Bearer nope"})[0] == 401
    assert call(auth_srv, "POST", "/embed", clip, {"Authorization": "Basic s3cret-token"})[0] == 401
    status, body = call(auth_srv, "POST", "/embed", clip, {"Authorization": "Bearer s3cret-token"})
    assert status == 200 and len(body["embedding"]) == 256
    # Health stays open so container health checks work without the token.
    assert call(auth_srv, "GET", "/health")[0] == 200


def test_Api_AuthOffWhenNoToken(open_srv, speak):
    status, _ = call(open_srv, "POST", "/embed", speak("low", SENTENCES[0]))
    assert status == 200
