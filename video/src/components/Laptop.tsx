import React from 'react';
import type {CSSProperties} from 'react';
import {C, F} from '../theme';

export const Laptop: React.FC<{w: number; h: number; children?: React.ReactNode; style?: CSSProperties}> = ({w, h, children, style}) => {
  const bez = 16;
  return (
    <div style={{position: 'relative', width: w + bez * 2 + 120, height: h + bez * 2 + 30, ...style}}>
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 0,
          width: w + bez * 2,
          height: h + bez * 2,
          borderRadius: '22px 22px 6px 6px',
          background: C.deeper,
          boxShadow: `0 0 0 2px ${C.border2}, 0 50px 100px -40px rgba(0,0,0,0.9)`,
        }}
      >
        <div style={{position: 'absolute', left: bez, top: bez, width: w, height: h, borderRadius: 8, overflow: 'hidden', background: C.deep}}>{children}</div>
        <div style={{position: 'absolute', top: 6, left: (w + bez * 2) / 2 - 4, width: 8, height: 8, borderRadius: 4, background: '#1d1f23'}} />
      </div>
      {/* base */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: h + bez * 2,
          height: 22,
          background: 'linear-gradient(#2a2c31, #1a1b1f)',
          borderRadius: '0 0 18px 18px',
          boxShadow: `0 0 0 1.5px ${C.border2}`,
        }}
      >
        <div style={{width: 180, height: 8, margin: '0 auto', background: '#121316', borderRadius: '0 0 8px 8px'}} />
      </div>
    </div>
  );
};

export type Line = {
  /** prefix glyph, e.g. "$", "›", "↳", "==>" */
  pre?: string;
  preColor?: string;
  text: string;
  color?: string;
  right?: string;
  rightColor?: string;
  /** entrance 0..1 */
  p?: number;
  /** progress bar 0..1, drawn under the line */
  bar?: number;
  indent?: number;
  spin?: number;
};

export const Terminal: React.FC<{lines: Line[]; title?: string; font?: number; style?: CSSProperties; maxLines?: number}> = ({
  lines,
  title = 'tempo-app — claude',
  font = 21,
  style,
  maxLines = 99,
}) => (
  <div style={{position: 'absolute', inset: 0, background: '#0e0f11', display: 'flex', flexDirection: 'column', ...style}}>
    <div style={{height: 46, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 9, borderBottom: `1px solid ${C.line}`, background: '#141518', flex: '0 0 46px'}}>
      {['#3d3f46', '#3d3f46', '#3d3f46'].map((c, i) => (
        <span key={i} style={{width: 13, height: 13, borderRadius: 7, background: c, display: 'inline-block'}} />
      ))}
      <span style={{flex: 1, textAlign: 'center', fontFamily: F.mono, fontSize: 15, color: C.meta, marginRight: 60}}>{title}</span>
    </div>
    <div
      style={{
        flex: 1,
        padding: '18px 28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: Math.round(font * 0.42),
        overflow: 'hidden',
      }}
    >
      {lines
        .filter((l) => (l.p ?? 1) > 0)
        .slice(-maxLines)
        .map((l, i) => {
        const p = l.p ?? 1;
        return (
          <div key={i} style={{opacity: p, transform: `translateX(${(1 - p) * -10}px)`, paddingLeft: (l.indent ?? 0) * font * 1.2}}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 14, fontFamily: F.mono, fontSize: font, lineHeight: 1.35, whiteSpace: 'pre'}}>
              {l.pre && <span style={{color: l.preColor ?? C.orange, minWidth: font * 1.4}}>{l.pre}</span>}
              <span style={{color: l.color ?? C.soft, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis'}}>{l.text}</span>
              {l.spin !== undefined && (
                <svg width={font} height={font} viewBox="0 0 22 22" style={{transform: `rotate(${l.spin * 360}deg)`, alignSelf: 'center'}}>
                  <circle cx="11" cy="11" r="8" stroke={C.border2} strokeWidth="3" fill="none" />
                  <path d="M11 3a8 8 0 0 1 8 8" stroke={C.orange} strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              )}
              {l.right && <span style={{color: l.rightColor ?? C.green}}>{l.right}</span>}
            </div>
            {l.bar !== undefined && (
              <div style={{height: 6, background: C.line, marginTop: 8, marginLeft: font * 1.4 + 14, width: '60%'}}>
                <div style={{height: 6, width: `${l.bar * 100}%`, background: C.orange}} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);
