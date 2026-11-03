import React from 'react';
import type {CSSProperties} from 'react';
import {C, F, mono} from '../theme';
import {BetaIcon, ICheck, TempoIcon} from './Icons';

// Logical iPhone screen in points. Everything inside a Phone is laid out at this size
// and the whole device is scaled, so screens look identical in the video and the stills.
export const SW = 393;
export const SH = 852;
const BEZEL = 12;
export const PW = SW + BEZEL * 2;
export const PH = SH + BEZEL * 2;

export const Phone: React.FC<{children?: React.ReactNode; scale?: number; style?: CSSProperties; glow?: boolean}> = ({
  children,
  scale = 1,
  style,
  glow = false,
}) => (
  <div style={{width: PW * scale, height: PH * scale, position: 'relative', ...style}}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: PW,
        height: PH,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        borderRadius: 66,
        background: C.deeper,
        boxShadow: `0 0 0 2px ${C.border2}, 0 0 0 5px #08090a, 0 40px 90px -30px rgba(0,0,0,0.85)${
          glow ? ', 0 0 120px -20px rgba(255,91,4,0.25)' : ''
        }`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: BEZEL,
          top: BEZEL,
          width: SW,
          height: SH,
          borderRadius: 55,
          overflow: 'hidden',
          background: C.deep,
        }}
      >
        {children}
        {/* Dynamic Island */}
        <div style={{position: 'absolute', top: 11, left: SW / 2 - 62, width: 124, height: 36, borderRadius: 20, background: '#000'}} />
        {/* home indicator */}
        <div style={{position: 'absolute', bottom: 8, left: SW / 2 - 70, width: 140, height: 5, borderRadius: 3, background: 'rgba(246,244,240,0.75)'}} />
      </div>
    </div>
  </div>
);

export const StatusBar: React.FC<{color?: string}> = ({color = C.head}) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 54,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 34px 0 44px',
      boxSizing: 'border-box',
      color,
      fontFamily: F.sans,
      fontWeight: 650,
      fontSize: 17,
      zIndex: 5,
    }}
  >
    <span>9:41</span>
    <span style={{display: 'flex', gap: 6, alignItems: 'center'}}>
      <svg width="18" height="12" viewBox="0 0 18 12" fill={color}>
        <rect x="0" y="8" width="3" height="4" rx="1" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
        <rect x="10" y="3" width="3" height="9" rx="1" />
        <rect x="15" y="0" width="3" height="12" rx="1" />
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M2 4.5a9 9 0 0 1 12 0M4.6 7.2a5.2 5.2 0 0 1 6.8 0" />
        <circle cx="8" cy="10" r="1" fill={color} />
      </svg>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
        <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={color} opacity="0.45" />
        <rect x="2.5" y="2.5" width="17" height="8" rx="2" fill={color} />
        <rect x="25" y="4.5" width="1.6" height="4" rx="0.8" fill={color} opacity="0.45" />
      </svg>
    </span>
  </div>
);

// ---------------------------------------------------------------------------
// Sample app in the story: "Tempo", a metronome. In build 42 the Start button
// sits under the home indicator (the bug). Build 43 lifts it into the safe area.
// ---------------------------------------------------------------------------
export const TempoScreen: React.FC<{fixed?: boolean; ring?: number; fixedBadge?: number; build?: number}> = ({
  fixed = false,
  ring = 0,
  fixedBadge = 0,
  build = 42,
}) => {
  const btnBottom = fixed ? 56 : -34;
  return (
    <div style={{position: 'absolute', inset: 0, background: C.deep}}>
      <StatusBar />
      <div style={{position: 'absolute', top: 70, left: 28, right: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <span style={{fontFamily: F.sans, fontWeight: 800, fontStretch: '108%', letterSpacing: '-0.04em', fontSize: 38, color: C.head}}>Tempo</span>
        <span style={{...mono, fontSize: 11, color: C.meta}}>Build {build}</span>
      </div>
      {/* dial */}
      <div
        style={{
          position: 'absolute',
          top: 170,
          left: SW / 2 - 135,
          width: 270,
          height: 270,
          borderRadius: '50%',
          border: `2px solid ${C.border2}`,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: F.sans, fontWeight: 800, fontStretch: '108%', letterSpacing: '-0.05em', fontSize: 96, color: C.head, lineHeight: 1}}>120</div>
          <div style={{...mono, fontSize: 13, color: C.meta, marginTop: 8}}>BPM</div>
        </div>
        <div style={{position: 'absolute', top: -7, left: 128, width: 14, height: 14, borderRadius: 7, background: C.orange}} />
      </div>
      {/* beat dots */}
      <div style={{position: 'absolute', top: 476, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18}}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{width: 16, height: 16, borderRadius: 8, background: i === 0 ? C.orange : C.border2}} />
        ))}
      </div>
      <div style={{position: 'absolute', top: 528, left: 28, right: 28, display: 'flex', gap: 10}}>
        {['4/4', 'Accent', 'Tap'].map((t) => (
          <div key={t} style={{flex: 1, height: 52, border: `1px solid ${C.border}`, background: C.panel, display: 'grid', placeItems: 'center', ...mono, fontSize: 12, color: C.body}}>
            {t}
          </div>
        ))}
      </div>
      {/* the Start button */}
      <div
        style={{
          position: 'absolute',
          left: 28,
          right: 28,
          bottom: btnBottom,
          height: 72,
          background: C.orange,
          color: C.ink,
          display: 'grid',
          placeItems: 'center',
          ...mono,
          fontWeight: 500,
          fontSize: 18,
        }}
      >
        Start
      </div>
      {ring > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: -10,
            height: 92,
            border: `3px dashed ${C.orange}`,
            borderRadius: 18,
            opacity: ring,
            transform: `scale(${1.15 - ring * 0.15})`,
          }}
        />
      )}
      {fixedBadge > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 46,
            height: 92,
            border: `3px solid ${C.green}`,
            borderRadius: 18,
            opacity: fixedBadge,
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: 14,
              top: -18,
              background: C.green,
              color: C.ink,
              ...mono,
              fontSize: 12,
              fontWeight: 500,
              padding: '7px 10px',
              display: 'flex',
              gap: 6,
              alignItems: 'center',
            }}
          >
            <ICheck size={14} color={C.ink} stroke={3} /> Fixed in 43
          </div>
        </div>
      )}
    </div>
  );
};

/** TestFlight's "send feedback" sheet, drawn generically in the site's palette. */
export const FeedbackSheet: React.FC<{y: number; text: string; caret?: boolean; pressed?: boolean}> = ({y, text, caret, pressed}) => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: SH - 70, transform: `translateY(${y}px)`, zIndex: 8}}>
    <div style={{position: 'absolute', inset: 0, background: '#1b1c20', borderRadius: '30px 30px 0 0', boxShadow: '0 -20px 60px rgba(0,0,0,0.5)'}}>
      <div style={{width: 40, height: 5, borderRadius: 3, background: C.border2, margin: '10px auto 0'}} />
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px 0'}}>
        <span style={{fontFamily: F.sans, fontSize: 17, color: C.meta}}>Cancel</span>
        <span style={{fontFamily: F.sans, fontSize: 17, fontWeight: 700, color: C.head}}>TestFlight Feedback</span>
        <span
          style={{
            fontFamily: F.sans,
            fontSize: 17,
            fontWeight: 700,
            color: C.ink,
            background: C.orange,
            padding: '6px 12px',
            transform: `scale(${pressed ? 0.92 : 1})`,
          }}
        >
          Submit
        </span>
      </div>
      <div style={{display: 'flex', gap: 16, padding: '26px 22px 0', alignItems: 'flex-start'}}>
        {/* screenshot thumbnail with markup */}
        <div style={{width: 118, height: 256, borderRadius: 14, overflow: 'hidden', position: 'relative', border: `1px solid ${C.border2}`, flex: '0 0 118px'}}>
          <div style={{width: SW, height: SH, transform: 'scale(0.3)', transformOrigin: 'top left', position: 'absolute'}}>
            <TempoScreen ring={1} />
          </div>
        </div>
        <div style={{flex: 1}}>
          <div style={{...mono, fontSize: 11, color: C.meta, marginBottom: 10}}>Comment</div>
          <div style={{fontFamily: F.sans, fontSize: 21, lineHeight: 1.35, color: text ? C.head : C.meta, minHeight: 140}}>
            {text || 'Tell the developer what happened'}
            {caret && <span style={{display: 'inline-block', width: 2, height: 24, background: C.orange, marginLeft: 2, verticalAlign: -4}} />}
          </div>
        </div>
      </div>
      <div style={{margin: '24px 22px 0', borderTop: `1px solid ${C.line}`, paddingTop: 16, display: 'grid', gap: 10}}>
        {[
          ['App', 'Tempo · build 42'],
          ['Device', 'iPhone 16 Pro · iOS 26'],
        ].map(([k, v]) => (
          <div key={k} style={{display: 'flex', justifyContent: 'space-between'}}>
            <span style={{...mono, fontSize: 11, color: C.meta}}>{k}</span>
            <span style={{fontFamily: F.sans, fontSize: 15, color: C.soft}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const Toast: React.FC<{opacity: number; text: string}> = ({opacity, text}) => (
  <div
    style={{
      position: 'absolute',
      top: 64,
      left: 24,
      right: 24,
      zIndex: 9,
      opacity,
      transform: `translateY(${(1 - opacity) * -20}px)`,
      background: '#22242a',
      border: `1px solid ${C.border2}`,
      borderRadius: 18,
      padding: '16px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontFamily: F.sans,
      fontSize: 18,
      fontWeight: 600,
      color: C.head,
    }}
  >
    <div style={{width: 30, height: 30, borderRadius: 15, background: C.green, display: 'grid', placeItems: 'center'}}>
      <ICheck size={18} color={C.ink} stroke={3} />
    </div>
    {text}
  </div>
);

/** Lock-screen style notification. */
export const Banner: React.FC<{y: number; opacity: number; pressed?: boolean}> = ({y, opacity, pressed}) => (
  <div
    style={{
      position: 'absolute',
      top: 58,
      left: 12,
      right: 12,
      zIndex: 9,
      opacity,
      transform: `translateY(${y}px) scale(${pressed ? 0.97 : 1})`,
      background: 'rgba(42,44,49,0.96)',
      border: `1px solid ${C.border2}`,
      borderRadius: 24,
      padding: '14px 16px',
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
    }}
  >
    <BetaIcon size={42} />
    <div style={{flex: 1}}>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span style={{fontFamily: F.sans, fontWeight: 700, fontSize: 16, color: C.head}}>TestFlight</span>
        <span style={{fontFamily: F.sans, fontSize: 14, color: C.meta}}>now</span>
      </div>
      <div style={{fontFamily: F.sans, fontSize: 16, color: C.soft, marginTop: 2}}>Tempo build 43 is ready to test.</div>
    </div>
  </div>
);

/** Beta-builds app page with the Update -> Open button. */
export const BetaScreen: React.FC<{state: 'update' | 'loading' | 'open'; loading?: number; pressed?: boolean}> = ({state, loading = 0, pressed}) => (
  <div style={{position: 'absolute', inset: 0, background: C.bg}}>
    <StatusBar />
    <div style={{position: 'absolute', top: 70, left: 24, right: 24}}>
      <div style={{fontFamily: F.sans, fontWeight: 800, fontStretch: '108%', letterSpacing: '-0.04em', fontSize: 34, color: C.head}}>TestFlight</div>
      <div style={{...mono, fontSize: 11, color: C.meta, marginTop: 22, marginBottom: 12}}>Apps</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`}}>
        <TempoIcon size={62} />
        <div style={{flex: 1}}>
          <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 20, color: C.head}}>Tempo</div>
          <div style={{fontFamily: F.sans, fontSize: 15, color: C.meta, marginTop: 2}}>Build 43 · just now</div>
        </div>
        <div
          style={{
            minWidth: 92,
            height: 36,
            borderRadius: 18,
            background: state === 'open' ? C.head : C.orange,
            color: C.ink,
            display: 'grid',
            placeItems: 'center',
            ...mono,
            fontWeight: 500,
            fontSize: 13,
            transform: `scale(${pressed ? 0.92 : 1})`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {state === 'loading' ? (
            <svg width="26" height="26" viewBox="0 0 26 26">
              <circle cx="13" cy="13" r="10" stroke="rgba(20,20,15,0.25)" strokeWidth="3" fill="none" />
              <circle
                cx="13"
                cy="13"
                r="10"
                stroke={C.ink}
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${loading * 62.8} 62.8`}
                transform="rotate(-90 13 13)"
                strokeLinecap="round"
              />
            </svg>
          ) : state === 'open' ? (
            'Open'
          ) : (
            'Update'
          )}
        </div>
      </div>
      <div style={{...mono, fontSize: 11, color: C.meta, marginTop: 26, marginBottom: 10}}>What to test</div>
      <div style={{fontFamily: F.sans, fontSize: 17, lineHeight: 1.45, color: C.soft}}>
        Start button now sits above the home indicator on every iPhone. Check it on yours.
      </div>
    </div>
  </div>
);

/** A finger tap ripple. */
export const Tap: React.FC<{x: number; y: number; p: number}> = ({x, y, p}) =>
  p <= 0 || p >= 1 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x - 34,
        top: y - 34,
        width: 68,
        height: 68,
        borderRadius: 34,
        background: 'rgba(246,244,240,0.28)',
        border: '2px solid rgba(246,244,240,0.6)',
        transform: `scale(${0.6 + p * 0.6})`,
        opacity: 1 - p,
        zIndex: 20,
      }}
    />
  );
