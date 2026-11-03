import React from 'react';
import type {CSSProperties} from 'react';
import {C, F, display, mono} from '../theme';

/** Footer used on every frame and every still: name left, site right, orange base bar. */
export const Footer: React.FC<{scale?: number; pad?: number}> = ({scale = 1, pad = 96}) => {
  const bar = Math.round(14 * scale);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: pad,
          right: pad,
          bottom: bar + Math.round(26 * scale),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          ...mono,
          letterSpacing: '0.18em',
          fontSize: Math.round(17 * scale),
          color: C.meta2,
        }}
      >
        <span style={{color: C.text, fontWeight: 500}}>Phil Woolley</span>
        <span>philwoolley.com</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: bar, background: C.orange}} />
    </>
  );
};

export const Eyebrow: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: CSSProperties}> = ({
  children,
  color = C.orange,
  size = 18,
  style,
}) => <div style={{...mono, fontSize: size, color, ...style}}>{children}</div>;

export const H: React.FC<{children: React.ReactNode; size: number; style?: CSSProperties}> = ({children, size, style}) => (
  <h1 style={{...display, fontSize: size, ...style}}>{children}</h1>
);

export const Body: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: CSSProperties}> = ({
  children,
  size = 30,
  color = C.body,
  style,
}) => (
  <p style={{fontFamily: F.sans, fontSize: size, lineHeight: 1.45, color, margin: 0, fontWeight: 400, ...style}}>{children}</p>
);

export const Accent: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{color: C.orange}}>{children}</span>
);

export const STEPS = [
  {n: '01', k: 'Test'},
  {n: '02', k: 'Feedback'},
  {n: '03', k: 'Ask'},
  {n: '04', k: 'Fix + ship'},
];

export const RAIL = {x: 96, y: 52, w: 236, h: 54, gap: 12};

/** Step chip. Used for the rail across the top of the video and in stills. */
export const Chip: React.FC<{
  n: string;
  k: string;
  state: 'idle' | 'active' | 'done';
  style?: CSSProperties;
  w?: number;
  h?: number;
  font?: number;
}> = ({n, k, state, style, w = RAIL.w, h = RAIL.h, font = 17}) => {
  const active = state === 'active';
  const done = state === 'done';
  return (
    <div
      style={{
        width: w,
        height: h,
        boxSizing: 'border-box',
        border: `1.5px solid ${active ? C.orange : C.border}`,
        background: active ? 'rgba(255,91,4,0.08)' : C.panel,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: `0 ${Math.round(h * 0.34)}px`,
        ...mono,
        fontSize: font,
        color: active ? C.head : done ? C.body : C.meta,
        ...style,
      }}
    >
      <span style={{color: active ? C.orange : done ? C.green : C.meta, fontWeight: 500}}>{done ? '✓' : n}</span>
      <span>{k}</span>
    </div>
  );
};

export const Rail: React.FC<{active: number; doneUpTo?: number; opacity?: number}> = ({active, doneUpTo = -1, opacity = 1}) => (
  <div style={{position: 'absolute', left: RAIL.x, top: RAIL.y, display: 'flex', gap: RAIL.gap, opacity}}>
    {STEPS.map((s, i) => (
      <Chip key={s.n} n={s.n} k={s.k} state={i === active ? 'active' : i <= doneUpTo ? 'done' : 'idle'} />
    ))}
  </div>
);
