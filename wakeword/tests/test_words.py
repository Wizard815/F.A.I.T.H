from engines import parse_words, slug


def test_any_phrase_one_per_line():
    words, problems = parse_words("# ours\nHey Faith\nokay, faith!\ncomputer @ 0.95\nhey jarvis = hey_jarvis.onnx @0.6  # trained\n\n")
    assert problems == []
    assert [(w.phrase, w.name, w.model, w.level) for w in words] == [
        ("hey faith", "hey_faith", None, None),
        ("okay faith", "okay_faith", None, None),
        ("computer", "computer", None, 0.95),
        ("hey jarvis", "hey_jarvis", "hey_jarvis.onnx", 0.6),
    ]


def test_what_goes_wrong_is_said():
    words, problems = parse_words("hey faith\nHey faith\ncomputer @ 7\n!!!\n")
    assert [w.phrase for w in words] == ["hey faith", "computer"]
    assert any("already a wake word" in p for p in problems)
    assert any("isn't between 0 and 1" in p for p in problems)
    assert any("no words" in p for p in problems)


def test_slug():
    assert slug("Hey, F.A.I.T.H!") == "hey_f_a_i_t_h"
