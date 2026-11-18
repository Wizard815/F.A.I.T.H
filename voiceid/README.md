# voiceid

A small local service that turns a voice clip into a speaker embedding: 256 numbers that describe how someone sounds. FAITH uses it to guess which family member is talking.

It runs entirely on your machine. The model is [Resemblyzer](https://github.com/resemble-ai/Resemblyzer)'s pretrained GE2E encoder. Its weights (`pretrained.pt`, 17 MB) ship inside the pip package, so nothing is downloaded when the service starts or runs. It runs on CPU.

## How FAITH uses it

1. FAITH sends the audio it already has (for example a browser recording) to `POST /embed`.
2. voiceid decodes it with ffmpeg, keeps only the voiced parts, and returns an embedding.
3. FAITH stores each person's averaged voiceprint and compares new embeddings to them (cosine similarity).

voiceid keeps nothing. Audio is held in memory and one temp file (mode 0600) that is deleted as soon as ffmpeg has decoded it. FAITH keeps voiceprints, never audio.

**A voice match only ever suggests who is speaking.** Voices can be imitated or replayed, and children in one family often sound alike. Never use a match to grant access, approve anything, or pick whose private tokens to use. Treat it as a hint ("sounds like Sam") that the person can confirm.

## API

`GET /health` returns `{"ok": true, "model": "resemblyzer-ge2e-0.1.4", "dim": 256}`. It never needs the token, so container health checks work.

`POST /embed` takes raw audio bytes as the body, with `Content-Type: audio/*` (or `video/webm`, `application/octet-stream`). WAV, WebM/Opus, Ogg, MP3, M4A and FLAC all work.

```sh
curl -sS -H 'Content-Type: audio/webm' -H "Authorization: Bearer $VOICEID_TOKEN" \
  --data-binary @clip.webm http://localhost:8099/embed
```

```json
{"embedding": [0.0123, ...], "seconds": 4.2, "speech_seconds": 3.6}
```

- `embedding`: 256 floats, L2-normalised, so a dot product is the cosine similarity.
- `seconds`: length of the decoded audio. `speech_seconds`: how much of it was voiced.

What goes wrong:

| Status | When |
|---|---|
| 400 | empty body, audio ffmpeg can't decode, or less than `VOICEID_MIN_SPEECH_SECONDS` of speech (silence, noise, "Hi.") |
| 401 | `VOICEID_TOKEN` is set and the `Authorization: Bearer` header is missing or wrong |
| 411 | no `Content-Length` (chunked uploads aren't accepted) |
| 413 | body over 15 MB |
| 415 | a non-audio `Content-Type`, such as `application/json` |

Use 3 to 10 seconds of clear speech. Short clips give noisy embeddings. Audio past `VOICEID_MAX_SECONDS` is ignored.

## Configuration

| Variable | Default | What |
|---|---|---|
| `VOICEID_PORT` | `8099` | port to listen on |
| `VOICEID_HOST` | `0.0.0.0` | address to bind |
| `VOICEID_TOKEN` | unset | if set, `/embed` needs `Authorization: Bearer <token>` (constant-time compare). Unset means open: keep the port on a private network. |
| `VOICEID_MIN_SPEECH_SECONDS` | `1.0` | less voiced audio than this is a 400 |
| `VOICEID_MAX_SECONDS` | `120` | only this much audio is decoded |
| `VOICEID_CONCURRENCY` | `2` | embeddings computed at once |
| `VOICEID_TORCH_THREADS` | torch default | CPU threads per embedding |
| `VOICEID_LOG_LEVEL` | `INFO` | logs never contain audio |

## Run

```sh
docker build -t faith-voiceid voiceid/
docker run -d --name voiceid -p 127.0.0.1:8099:8099 --tmpfs /tmp \
  -e VOICEID_TOKEN=change-me faith-voiceid
```

`--tmpfs /tmp` keeps the short-lived temp file in memory. The image runs as a non-root user and has a `HEALTHCHECK` on `/health`. It is large (about 2 GB unpacked), mostly CPU-only PyTorch and ffmpeg.

## Develop

```sh
python3.12 -m venv .venv
.venv/bin/pip install --no-deps -r requirements-dev.txt
.venv/bin/python server.py
.venv/bin/python -m pytest -s      # needs ffmpeg and espeak-ng
```

`requirements.txt` is a full lock. Install it with `--no-deps`: resemblyzer declares `webrtcvad`, which needs a compiler, and `webrtcvad-wheels` provides the same module prebuilt.

The tests use the real model. They make two synthetic voices with espeak-ng and check that two clips of one voice are closer than clips of different voices. They also cover each audio format, silence, noise, garbage, auth and the size limit. Without espeak-ng the model tests are skipped.
