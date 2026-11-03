// Bundle once, then render many stills / preview frames.
//
//   node scripts/render-stills.mjs graphics            -> README + site graphics into out/graphics/
//   node scripts/render-stills.mjs frames 60 500 1300  -> Explainer frames into out/frames/
//
// Set REMOTION_BROWSER to a Chrome/Chromium binary if Remotion can't download its own.
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const browserExecutable = process.env.REMOTION_BROWSER || null;
// Keep in sync with POSTER_FRAME in src/stills/Stills.tsx (work.trackerFixed + 8).
const timeline = JSON.parse(fs.readFileSync('src/timeline.json', 'utf8'));
const POSTER_FRAME = timeline.cues.work.trackerFixed + 8;
const [mode = 'graphics', ...rest] = process.argv.slice(2);

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});

const jobs =
  mode === 'frames'
    ? rest.map((f) => ({id: 'Explainer', frame: Number(f), out: `out/frames/f${String(f).padStart(4, '0')}.png`}))
    : [
        {id: 'Hero', out: 'out/graphics/hero.png'},
        {id: 'TheLoop', out: 'out/graphics/the-loop.png'},
        {id: 'HowItConnects', out: 'out/graphics/how-it-connects.png'},
        {id: 'TheLoopBare', out: 'out/graphics/the-loop-web.png'},
        {id: 'HowItConnectsBare', out: 'out/graphics/how-it-connects-web.png'},
        {id: 'PosterPlay', frame: POSTER_FRAME, out: 'out/graphics/video-thumbnail.png'},
        {id: 'Poster', frame: POSTER_FRAME, out: 'out/graphics/poster.jpg', format: 'jpeg'},
        {id: 'OG', out: 'out/graphics/og.png'},
      ];

for (const job of jobs) {
  fs.mkdirSync(path.dirname(job.out), {recursive: true});
  const composition = await selectComposition({serveUrl, id: job.id, browserExecutable});
  await renderStill({
    composition,
    serveUrl,
    output: job.out,
    frame: job.frame ?? 0,
    imageFormat: job.format ?? 'png',
    ...(job.format === 'jpeg' ? {jpegQuality: 88} : {}),
    scale: job.scale ?? 1,
    browserExecutable,
    overwrite: true,
  });
  console.log('wrote', job.out);
}
