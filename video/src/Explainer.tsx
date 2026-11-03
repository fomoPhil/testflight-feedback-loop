import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, getStaticFiles} from 'remotion';
import {C, T, SceneName} from './theme';
import {Footer} from './components/Brand';
import {End, Intro, Open, Problem} from './scenes/Titles';
import {Ask, Feedback, Update, Work} from './scenes/Story';
import {Loop, Needs} from './scenes/Outro';

const SCENES: [SceneName, React.FC][] = [
  ['open', Open],
  ['problem', Problem],
  ['intro', Intro],
  ['feedback', Feedback],
  ['ask', Ask],
  ['work', Work],
  ['update', Update],
  ['loop', Loop],
  ['needs', Needs],
  ['end', End],
];

export const EXPLAINER_FRAMES = T.scenes.end.from + T.scenes.end.dur;

export const Explainer: React.FC = () => {
  const hasAudio = getStaticFiles().some((f) => f.name === 'soundtrack.wav');
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {SCENES.map(([name, Comp]) => (
        <Sequence key={name} from={T.scenes[name].from} durationInFrames={T.scenes[name].dur} name={name}>
          <Comp />
        </Sequence>
      ))}
      <Footer />
      {hasAudio && <Audio src={staticFile('soundtrack.wav')} />}
    </AbsoluteFill>
  );
};
