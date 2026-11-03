import type {CSSProperties} from 'react';
import {continueRender, delayRender, interpolate, spring, Easing} from 'remotion';
import '@fontsource-variable/archivo/standard.css';
import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
import timeline from './timeline.json';

// philwoolley.com "builder" design language: dark ground, Archivo 800 display,
// DM Mono uppercase labels, one orange accent, green for "done", gold for badges.
export const C = {
  bg: '#131417',
  panel: '#16171a',
  panel2: '#191a1e',
  deep: '#101114',
  deeper: '#0b0c0e',
  line: '#26282d',
  line2: '#202227',
  border: '#2a2c31',
  border2: '#3d3f46',
  head: '#f6f4f0',
  text: '#edeae4',
  tile: '#f0eee9',
  soft: '#d5d2cc',
  body: '#a3a0a9',
  meta: '#8e8b95',
  meta2: '#93909a',
  orange: '#ff5b04',
  orange2: '#ff7a33',
  green: '#4bd6a0',
  gold: '#e8c15c',
  ink: '#14140f',
} as const;

export const F = {
  sans: "'Archivo Variable', 'Archivo', system-ui, sans-serif",
  mono: "'DM Mono', ui-monospace, 'SF Mono', Menlo, monospace",
};

export const display: CSSProperties = {
  fontFamily: F.sans,
  fontWeight: 800,
  fontStretch: '108%',
  letterSpacing: '-0.042em',
  lineHeight: 1,
  color: C.head,
  margin: 0,
};

export const mono: CSSProperties = {
  fontFamily: F.mono,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
};

export const T = timeline;
export type SceneName = keyof typeof timeline.scenes;

// Make sure both families are ready before Remotion captures any frame.
const fontHandle = delayRender('Loading Archivo + DM Mono');
Promise.all([
  document.fonts.load(`800 64px 'Archivo Variable'`),
  document.fonts.load(`500 64px 'Archivo Variable'`),
  document.fonts.load(`400 64px 'Archivo Variable'`),
  document.fonts.load(`400 24px 'DM Mono'`),
  document.fonts.load(`500 24px 'DM Mono'`),
])
  .then(() => continueRender(fontHandle))
  .catch(() => continueRender(fontHandle));

// ---------- motion helpers ----------
export const ease = Easing.bezier(0.22, 0.61, 0.36, 1);

/** 0 -> 1 between two frames, eased, clamped. */
export const prog = (frame: number, from: number, dur = 18) =>
  interpolate(frame, [from, from + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

export const springIn = (frame: number, fps: number, delay = 0, damping = 200) =>
  spring({frame: frame - delay, fps, config: {damping, mass: 0.9, stiffness: 140}});

/** Entrance: fade + rise. */
export const rise = (frame: number, from: number, dist = 28, dur = 20): CSSProperties => {
  const p = prog(frame, from, dur);
  return {opacity: p, transform: `translateY(${(1 - p) * dist}px)`};
};

/** Scene envelope: fade in at the start, out at the end. */
export const envelope = (frame: number, dur: number, inF = 10, outF = 12) =>
  Math.min(prog(frame, 0, inF), 1 - prog(frame, dur - outF, outF));

export const typed = (text: string, frame: number, from: number, to: number) => {
  const n = Math.round(interpolate(frame, [from, to], [0, text.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return text.slice(0, n);
};
