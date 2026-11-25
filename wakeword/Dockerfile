# wakeword: FAITH's wake words for Home Assistant (Wyoming, port 10400).
# Build: docker build -t faith-wake wakeword/
ARG BASE=python:3.12.16-slim-trixie
FROM ${BASE}

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    WAKE_WORDS_FILE=/config/wake_words.txt \
    WAKE_MODELS=/config/models

# ffmpeg: only for `--test` with your own recordings.
RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt fetch_models.py ./
RUN pip install --no-deps -r requirements.txt && python fetch_models.py /app

COPY engines.py server.py common_en.txt wake_words.example.txt ./

RUN useradd --system --uid 10001 --home-dir /nonexistent --shell /usr/sbin/nologin wake \
 && mkdir -p /config && chown wake /config
USER wake

EXPOSE 10400
CMD ["python", "server.py"]
