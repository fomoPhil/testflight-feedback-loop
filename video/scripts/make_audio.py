#!/usr/bin/env python3
"""Synthesize the explainer soundtrack: a quiet music bed plus UI sound effects.

Every sound effect is placed from src/timeline.json, the same cue sheet the Remotion
scenes animate from, so picture and sound stay in sync when timings change.

    python3 scripts/make_audio.py public/soundtrack.wav

Needs numpy. No samples, no downloads: everything is generated here.
"""
import json
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / "src" / "timeline.json").read_text())
FPS = TL["fps"]
S = TL["scenes"]
Q = TL["cues"]
TOTAL_FRAMES = S["end"]["from"] + S["end"]["dur"]
DUR = TOTAL_FRAMES / FPS
N = int(DUR * SR)
rng = np.random.default_rng(7)

L = np.zeros(N)
R = np.zeros(N)


def t_of(scene, cue=0):
    return (S[scene]["from"] + cue) / FPS


def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    L[i : i + len(sig)] += sig * gain * (1 - max(0, pan))
    R[i : i + len(sig)] += sig * gain * (1 + min(0, pan))


def env(n, a=0.005, d=0.2):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
    return e


def onepole_lp(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def hp(x, cutoff):
    return x - onepole_lp(x, cutoff)


def note(f):
    return 440.0 * 2 ** ((f - 69) / 12)


# ---------------------------------------------------------------- sound effects
def click(level=1.0, f=2400, d=0.012):
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / d)
    s += rng.normal(0, 0.3, n) * np.exp(-t / (d * 0.5))
    return s * 0.35 * level


def key_tick():
    return click(0.55, f=rng.uniform(1800, 3200), d=0.006)


def thock(f=150, d=0.09):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    fr = f * (1 + 0.6 * np.exp(-t / 0.02))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    return np.sin(ph) * env(n, 0.002, d) * 0.6


def whoosh(d=0.45, up=True, level=1.0):
    n = int(d * SR)
    noise = rng.normal(0, 1, n)
    # moving band via two one-pole filters with a sweep, done in chunks
    out = np.zeros(n)
    chunks = 24
    for c in range(chunks):
        a, b = c * n // chunks, (c + 1) * n // chunks
        k = c / (chunks - 1)
        fc = 300 + (4000 if up else 2500) * (k if up else 1 - k)
        seg = noise[a:b]
        out[a:b] = hp(onepole_lp(seg, fc * 1.6), fc * 0.5)
    shape = np.sin(np.linspace(0, np.pi, n)) ** 1.5
    return out * shape * 0.22 * level


def shutter():
    s = np.zeros(int(0.2 * SR))
    for off, lvl in ((0.0, 1.0), (0.055, 0.7)):
        n = int(0.04 * SR)
        t = np.arange(n) / SR
        b = hp(rng.normal(0, 1, n), 1500) * np.exp(-t / 0.008) * lvl
        i = int(off * SR)
        s[i : i + n] += b
    return s * 0.45


def chime(freqs, d=0.9, level=1.0, spacing=0.0):
    total = int((d + spacing * len(freqs) + 0.1) * SR)
    s = np.zeros(total)
    for k, f in enumerate(freqs):
        n = int(d * SR)
        t = np.arange(n) / SR
        tone = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.01 * t) + 0.12 * np.sin(2 * np.pi * f * 3.98 * t))
        tone *= env(n, 0.003, d * 0.32)
        i = int(k * spacing * SR)
        s[i : i + n] += tone
    return s * 0.16 * level


def pop(f0=660, f1=1180):
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    fr = np.linspace(f0, f1, n)
    ph = 2 * np.pi * np.cumsum(fr) / SR
    return np.sin(ph) * env(n, 0.002, 0.05) * 0.3


def scratch():
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    s = hp(rng.normal(0, 1, n), 2500) * np.exp(-t / 0.03)
    return s * 0.16


# ---------------------------------------------------------------- music bed
BPM = 100
BEAT = 60 / BPM
BAR = BEAT * 4
CHORDS = [  # midi notes; A minor-ish, warm and unresolved until the end
    [57, 60, 64, 67, 71],  # Am9-ish
    [53, 57, 60, 64, 67],  # Fmaj9
    [48, 55, 60, 64, 67],  # C(add9)
    [55, 59, 62, 64, 69],  # G6/9
]


def pad_layer():
    out_l = np.zeros(N)
    out_r = np.zeros(N)
    seg = BAR * 2
    t_all = 0.0
    k = 0
    end_at = t_of("end") + 0.2
    while t_all < end_at:
        chord = CHORDS[k % 4]
        n = int((seg + 1.2) * SR)
        t = np.arange(n) / SR
        e = np.minimum(1, t / 0.9) * np.minimum(1, np.maximum(0, (seg + 1.2 - t) / 1.2))
        for m in chord:
            f = note(m)
            for det, side in ((-0.18, "l"), (0.18, "r")):
                ff = f * 2 ** (det / 12 / 4)
                tone = np.sin(2 * np.pi * ff * t) + 0.35 * np.sin(2 * np.pi * ff * 2 * t) + 0.12 * np.sin(2 * np.pi * ff * 3 * t)
                tgt = out_l if side == "l" else out_r
                i = int(t_all * SR)
                m_ = min(n, N - i)
                if m_ > 0:
                    tgt[i : i + m_] += tone[:m_] * e[:m_] * 0.012
        t_all += seg
        k += 1
    # final chord: resolve to A minor (add9) under the end card
    n = int((DUR - end_at + 0.2) * SR)
    t = np.arange(n) / SR
    e = np.minimum(1, t / 0.4) * np.exp(-t / 2.4)
    for m in [45, 57, 64, 67, 71, 72]:
        f = note(m)
        tone = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2 * t)
        i = int((end_at - 0.2) * SR)
        m_ = min(n, N - i)
        out_l[i : i + m_] += tone[:m_] * e[:m_] * 0.014
        out_r[i : i + m_] += tone[:m_] * e[:m_] * 0.014
    return onepole_lp(out_l, 1800), onepole_lp(out_r, 1800)


def kick():
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    fr = 48 + 70 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(fr) / SR
    return np.sin(ph) * env(n, 0.001, 0.16) * 0.5


def hat():
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    return hp(rng.normal(0, 1, n), 6000) * np.exp(-t / 0.012) * 0.06


def pluck(f, d=0.28):
    n = int(d * 1.6 * SR)
    t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 2 * t)) * env(n, 0.002, d * 0.4)
    return s * 0.05


def rhythm():
    story_from = t_of("feedback")
    story_to = t_of("needs") + S["needs"]["dur"] / FPS
    work_from, work_to = t_of("work"), t_of("update")
    b = 0
    while True:
        at = story_from + b * BEAT
        if at >= story_to:
            break
        add(kick(), at, 0.55 if work_from <= at < work_to else 0.35)
        if work_from <= at < work_to:
            add(hat(), at + BEAT / 2, 1.0, pan=0.3)
            add(hat(), at + BEAT * 0.75, 0.5, pan=-0.3)
        b += 1
    # arpeggio through the work scene, for momentum
    k = 0
    at = work_from
    while at < work_to - 0.3:
        bar_idx = int((at) / (BAR * 2)) % 4
        chord = CHORDS[bar_idx]
        m = chord[[0, 2, 4, 3, 1, 2, 4, 3][k % 8]] + 12
        add(pluck(note(m)), at, 1.0, pan=0.35 if k % 2 else -0.35)
        at += BEAT / 2
        k += 1


# ---------------------------------------------------------------- place everything
pl, pr = pad_layer()
L += pl
R += pr
rhythm()

# scene transitions
for name in ["problem", "intro", "feedback", "ask", "work", "update", "loop", "needs", "end"]:
    add(whoosh(0.5, up=True, level=0.7), t_of(name) - 0.18)

# open
add(thock(130), t_of("open", Q["open"]["line1"]), 0.5)
add(thock(160), t_of("open", Q["open"]["line2"]), 0.45)

# problem: one scratch per struck line
pq = Q["problem"]
for i in range(6):
    add(click(0.4, 1600), t_of("problem", pq["items"] + i * pq["itemGap"]), 0.6)
for i in range(4):
    add(scratch(), t_of("problem", pq["strike"] + i * pq["strikeGap"]))
add(thock(200, 0.12), t_of("problem", pq["now"]), 0.7)

# intro chips + dock
iq = Q["intro"]
for i in range(4):
    add(click(0.6, 2000 + i * 200), t_of("intro", iq["chips"] + i * 6))
add(whoosh(0.4, up=False, level=0.6), t_of("intro", iq["dock"]))

# feedback
fq = Q["feedback"]
add(pop(500, 700), t_of("feedback", fq["ring"]), 0.7)
add(shutter(), t_of("feedback", fq["shutter"]), 0.6)
add(whoosh(0.35, up=True, level=0.5), t_of("feedback", fq["sheet"]))
fr = fq["typeFrom"]
while fr < fq["typeTo"]:
    add(key_tick(), t_of("feedback", fr), pan=rng.uniform(-0.2, 0.2))
    fr += rng.choice([1, 2, 2, 3])
add(click(0.9, 1800), t_of("feedback", fq["submit"]))
add(pop(), t_of("feedback", fq["sent"] + 6))

# ask
aq = Q["ask"]
add(whoosh(0.3, up=False, level=0.5), t_of("ask", aq["swap"]))
fr = aq["typeFrom"]
while fr < aq["typeTo"]:
    add(key_tick(), t_of("ask", fr), pan=rng.uniform(-0.2, 0.2))
    fr += rng.choice([1, 2, 2, 3])
add(whoosh(0.28, up=True, level=0.9), t_of("ask", aq["send"]))

# work: a soft tick per terminal line, chime on VALID
wq = Q["work"]
for key in ["prompt", "auth", "list", "listOut", "tracker", "edit", "tests", "bump", "archive", "archiveOk", "export", "exportOk", "upload", "uploadOk", "poll", "trackerFixed"]:
    add(click(0.45, 2600, 0.008), t_of("work", wq[key]), pan=0.25)
for key in ["msg1", "msg2", "msg3"]:
    add(pop(700, 900), t_of("work", wq[key]), 0.5, pan=-0.3)
add(chime([note(76), note(83), note(88)], d=1.4, spacing=0.09, level=1.1), t_of("work", wq["valid"]))

# update
uq = Q["update"]
add(chime([note(84), note(91)], d=0.7, spacing=0.12, level=0.9), t_of("update", uq["banner"]))
for key in ["tapBanner", "tapUpdate", "open"]:
    add(click(0.8, 1500), t_of("update", uq[key]))
add(chime([note(72), note(79), note(84)], d=1.2, spacing=0.07, level=0.8), t_of("update", uq["fixed"]))
add(click(0.5, 2200), t_of("update", uq["tracker"]))

# loop: tick each time the comet passes the top
lq = Q["loop"]
lap_frames = lq["lap"]
f = 24
while f < S["loop"]["dur"] - 10:
    add(click(0.5, 2800, 0.01), t_of("loop", f))
    f += lap_frames

# needs: one tick per checked item
nq = Q["needs"]
for i in range(10):
    add(click(0.45, 2300 + 40 * i, 0.008), t_of("needs", nq["items"] + i * nq["itemGap"]), pan=-0.1 + 0.02 * i)

# end
add(thock(90, 0.3), t_of("end", 4), 0.55)

# ---------------------------------------------------------------- master
mix = np.stack([L, R], axis=1)
fade = int(2.2 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix[: int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))[:, None]
mix = mix / np.max(np.abs(mix))
mix = np.tanh(mix * 2.0) / np.tanh(2.0)
peak = np.max(np.abs(mix))
mix = mix / peak * 0.8
pcm = (mix * 32767).astype(np.int16)

out = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "public" / "soundtrack.wav")
out.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(out), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"wrote {out} ({DUR:.1f}s)")
