# wakeword

FAITH's wake words for Home Assistant's voice pipeline. **Any phrase can be a wake word, and you can have as many as you like:** "hey faith", "okay faith", "computer", each child's own. It runs on your server, and nothing leaves it.

It's a [Wyoming](https://github.com/OHF-Voice/wyoming) wake word service, like HA's openWakeWord add-on, so HA and Wyoming satellites use it the same way.

## Two kinds of wake word

| | Any phrase | Trained model |
|---|---|---|
| How | Speech recognition (Vosk, small English model) listening only for your phrases and everyday words | An [openWakeWord](https://github.com/dscripka/openWakeWord) model made for one phrase |
| Set up | Write the phrase in the file | Train a model (about an hour), put the `.onnx` file in `models/` |
| Good at | Trying words out, extra words, children's own words | Your main wake word: fewer false wakes, works when said fast |

Both can be on at once, in one list.

**How well it hears (synthetic voices, `tests/`):** "hey faith" was heard every time at a normal pace, about 0.9 s into speaking. It was missed when said very fast. Close sound-alikes set it off sometimes: "they say faith", "I have faith". "Safe and sound", "hey fate" and ordinary talk didn't. A trained model told "hey jarvis" apart from "hey travis" and "jarvis". Real voices differ: test yours (below).

## The wake words file

`/config/wake_words.txt` (written with "hey faith" and "okay faith" on first start). One wake word per line:

```
hey faith
okay faith @ 0.95              # more sure before it counts (0 to 1; default 0.9)
computer
hey jarvis = hey_jarvis.onnx   # a trained model in /config/models
```

- Save the file and the next listen uses it. No restart.
- Home Assistant shows each word, plus **any** (all of them at once). Reload the Wyoming integration in HA to see new words in its list.
- Words must be ones the speech model knows. `--check` says which aren't. Spell them as words it knows ("jar vis"), or train a model.
- Choose phrases of two or three words that don't come up in everyday talk. "Faith" alone would wake it in "I have faith".

## Check and test

```bash
docker exec faith-wake python server.py --check
```

Record yourself on your phone saying the wake word a few times, with other talk in between, and copy the file to `/config`:

```bash
docker exec faith-wake python server.py --test /config/test.m4a
```

It prints when each wake word was heard. If it misses you, lower that word's level (`@ 0.8`). If it wakes on other talk, raise it, pick a longer phrase, or train a model.

## Train a model (optional)

Use openWakeWord's automatic training ([its README](https://github.com/dscripka/openWakeWord#training-new-models) links the notebook). It makes thousands of synthetic clips of your phrase with Piper text-to-speech, so no family recordings are needed.

- The notebook runs on Google Colab (Google's computers) or on your own machine with the openWakeWord training scripts.
- Export the `.onnx` file, put it in `/config/models/`, and add `hey faith = hey_faith.onnx` to the file.
- A trained word's level is its model's score (default 0.5): `@ 0.7` for fewer false wakes.

## Run

The compose file next to FAITH's (`docker-compose.example.yml`) has it as `faith-wake`:

```bash
docker build -t faith-wake wakeword/
docker run -d --name faith-wake -p 10400:10400 -v /mnt/user/appdata/faith/wake:/config faith-wake
```

The models (about 70 MB) are downloaded while the image is built and checked by sha256. Running it uses about a tenth of a CPU core for each satellite that's listening.

Without Docker (Python 3.12+, ffmpeg for `--test`):

```bash
cd wakeword
pip install --no-deps -r requirements.txt
python fetch_models.py
WAKE_WORDS_FILE=./wake_words.txt WAKE_MODELS=./models python server.py
```

Tests: `pip install --no-deps -r requirements-dev.txt && python -m pytest` (needs `espeak-ng` and `ffmpeg`).

## Configuration

| Variable | Default | What |
|---|---|---|
| `WAKE_URI` | `tcp://0.0.0.0:10400` | where to listen |
| `WAKE_WORDS_FILE` | `/config/wake_words.txt` | the wake words |
| `WAKE_MODELS` | `/config/models` | trained `.onnx` models |
| `WAKE_WORDS` | `hey faith` | used only when there's no file and none could be written (`;` between words) |
| `WAKE_MIN_CONFIDENCE` | `0.9` | default level for any-phrase words |
| `WAKE_THRESHOLD` | `0.5` | default level for trained models |
| `WAKE_VOSK_MODEL` | `/app/vosk-model` | a different Vosk model (another language: alphacephei.com/vosk/models) |
| `WAKE_COMMON_WORDS` | `/app/common_en.txt` | everyday words for that language |
| `WAKE_LOG_LEVEL` | `INFO` | logs say which phrase was heard, never the audio |

**What goes wrong:**
- HA says it can't connect: the container isn't running, or port 10400 isn't reachable from HA.
- A word never wakes it: run `--check` (an unknown word is skipped) and `--test` with your own recording.
- It wakes on the TV: raise that word's level, or train a model for it.
