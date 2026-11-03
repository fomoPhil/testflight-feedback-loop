import React from 'react';
import {Composition, Still} from 'remotion';
import {T} from './theme';
import {Explainer, EXPLAINER_FRAMES} from './Explainer';
import {Hero, HowItConnects, HowItConnectsBare, OG, Poster, PosterPlay, TheLoop, TheLoopBare} from './stills/Stills';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Explainer" component={Explainer} durationInFrames={EXPLAINER_FRAMES} fps={T.fps} width={T.width} height={T.height} />
    {/* README + site graphics, drawn with the same components as the video */}
    <Still id="Hero" component={Hero} width={1600} height={800} />
    <Still id="TheLoop" component={TheLoop} width={1600} height={900} />
    <Still id="HowItConnects" component={HowItConnects} width={1600} height={900} />
    {/* same diagrams without title + footer, for the project page where the section heading carries the title */}
    <Still id="TheLoopBare" component={TheLoopBare} width={1600} height={630} />
    <Still id="HowItConnectsBare" component={HowItConnectsBare} width={1600} height={670} />
    {/* poster + README thumbnail: a real frame of the Work scene, so render frame POSTER_FRAME */}
    <Composition id="Poster" component={Poster} durationInFrames={T.scenes.work.dur} fps={T.fps} width={1920} height={1080} />
    <Composition id="PosterPlay" component={PosterPlay} durationInFrames={T.scenes.work.dur} fps={T.fps} width={1920} height={1080} />
    <Still id="OG" component={OG} width={1200} height={630} />
  </>
);
