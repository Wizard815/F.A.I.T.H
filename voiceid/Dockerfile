# voiceid: local speaker-embedding service for FAITH.
# Build: docker build -t faith-voiceid voiceid/
ARG BASE=python:3.12.16-slim-trixie
FROM ${BASE}

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    NUMBA_CACHE_DIR=/tmp/numba \
    VOICEID_PORT=8099

RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
# --no-deps: requirements.txt is a full lock (see its header). CPU-only torch
# comes from the PyTorch CPU index named in the file.
RUN pip install --no-deps -r requirements.txt \
 && rm -rf /usr/local/lib/python3.12/site-packages/torch/include \
 && find /usr/local/lib/python3.12/site-packages -depth -type d -name tests -path '*/sklearn/*' -exec rm -rf {} + \
 && python -c "import resemblyzer, pathlib; p = pathlib.Path(resemblyzer.__file__).parent / 'pretrained.pt'; assert p.stat().st_size > 1_000_000, p"

COPY server.py .

RUN useradd --system --uid 10001 --home-dir /nonexistent --shell /usr/sbin/nologin voiceid
USER voiceid

EXPOSE 8099
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD ["python", "-c", "import os, urllib.request; urllib.request.urlopen('http://127.0.0.1:%s/health' % os.environ.get('VOICEID_PORT', '8099'), timeout=4)"]

CMD ["python", "server.py"]
