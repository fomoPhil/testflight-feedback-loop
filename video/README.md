# Explainer video + README graphics

Everything visual for testflight-feedback-loop is drawn here in [Remotion](https://www.remotion.dev), in the
[philwoolley.com](https://philwoolley.com) design language: `#131417` ground, Archivo 800 display type,
DM Mono labels, one orange accent (`#ff5b04`), green for "done", and a name + site footer over an orange base bar.

The video and the stills share components (`src/components/`), so the phone, chat, terminal and loop look
identical everywhere.

| Output | Composition | Where it's used |
|---|---|---|
| `testflight-feedback-loop-explainer.mp4` (1920×1080, 80s) | `Explainer` | philwoolley.com/testflight-feedback-loop |
| `hero.png` | `Hero` | README header, homepage tile |
| `the-loop.png` | `TheLoop` | README, project page |
| `how-it-connects.png` | `HowItConnects` | README, project page |
| `the-loop-web.png`, `how-it-connects-web.png` | `TheLoopBare`, `HowItConnectsBare` | project page (no title or footer; the page heading carries it) |
| `video-thumbnail.png` | `PosterPlay` (frame of the Fix + ship scene) | README "Watch it" link |
| `poster.jpg` | `Poster` (same frame, no play badge) | `<video poster>` on the project page, homepage tile |
| `og.png` (1200×630) | `OG` | social share image for the project page |

## Run it

```bash
cd video
npm install
npm run audio          # synthesizes public/soundtrack.wav (needs python3 + numpy)
npm run studio         # live preview + timeline
npm run render         # -> out/testflight-feedback-loop-explainer.mp4
node scripts/render-stills.mjs graphics   # -> out/graphics/*
```

If Remotion can't download its own headless Chrome, point it at one you have:
`REMOTION_BROWSER=/path/to/chrome node scripts/render-stills.mjs graphics`, and pass
`--browser-executable=/path/to/chrome` to `npm run render`.

## Changing the timing

`src/timeline.json` is the cue sheet. Scene start frames and in-scene cues (when a line types, when the build
goes VALID) live there, and both the scenes and `scripts/make_audio.py` read it. Change a number, re-run
`npm run audio` and `npm run render`, and the sound effects move with the picture.

## Sound

`scripts/make_audio.py` generates the whole soundtrack: a quiet pad and pulse in A minor, an arpeggio while the
Mac works, and UI sounds (key ticks, screenshot shutter, notification chime, a success chime on VALID). No
samples, nothing downloaded, so there's nothing to license.

The sample app in the story ("Tempo") is made up. The TestFlight and Claude app screens are simplified
illustrations in this palette, not pixel copies.
