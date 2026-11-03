import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, T, display, envelope, mono, prog, rise} from '../theme';
import {Accent, Body, Chip, Eyebrow, H, RAIL, STEPS} from '../components/Brand';

const M = 96;

// ---------------------------------------------------------------------------
// 1. Cold open
// ---------------------------------------------------------------------------
export const Open: React.FC = () => {
  const f = useCurrentFrame();
  const q = T.cues.open;
  const dur = T.scenes.open.dur;
  const out = 1 - prog(f, dur - 14, 14);
  const line = (from: number): React.CSSProperties => {
    const p = prog(f, from, 22);
    return {transform: `translateY(${(1 - p) * 110}%)`, display: 'block'};
  };
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', left: M, top: 230}}>
        <Eyebrow size={20} style={{...rise(f, 0, 12, 16)}}>
          testflight-feedback-loop
        </Eyebrow>
        <div style={{marginTop: 36}}>
          <div style={{overflow: 'hidden', paddingBottom: 8}}>
            <span style={{...display, fontSize: 150, ...line(q.line1)}}>Fix your iPhone app</span>
          </div>
          <div style={{overflow: 'hidden', paddingBottom: 14}}>
            <span style={{...display, fontSize: 150, ...line(q.line2)}}>
              from your iPhone<Accent>.</Accent>
            </span>
          </div>
        </div>
        <Body size={40} color={C.soft} style={{marginTop: 40, ...rise(f, q.sub)}}>
          Send feedback. Tell your agent to check it. The next build shows up on your phone.
        </Body>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 2. The old loop
// ---------------------------------------------------------------------------
const OLD = [
  'Spot a bug on your phone',
  'Walk back to your Mac',
  'Open Xcode, find it, fix it',
  'Archive. Export. Upload.',
  'Wait for processing',
  'Pick your phone back up',
];

export const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const q = T.cues.problem;
  const dur = T.scenes.problem.dur;
  return (
    <AbsoluteFill style={{opacity: envelope(f, dur, 8, 14)}}>
      <div style={{position: 'absolute', left: M, top: 150, width: 820}}>
        <Eyebrow style={rise(f, q.head)}>The old loop</Eyebrow>
        <H size={84} style={{marginTop: 24, ...rise(f, q.head + 4)}}>
          Every fix meant a trip back to the desk.
        </H>
      </div>
      <div style={{position: 'absolute', left: 1010, top: 168, width: 820}}>
        {OLD.map((t, i) => {
          const at = q.items + i * q.itemGap;
          const struck = i >= 1 && i <= 4;
          const sp = struck ? prog(f, q.strike + (i - 1) * q.strikeGap, 12) : 0;
          return (
            <div
              key={t}
              style={{
                display: 'flex',
                gap: 26,
                alignItems: 'center',
                height: 104,
                borderTop: `1px solid ${C.line}`,
                borderBottom: i === OLD.length - 1 ? `1px solid ${C.line}` : undefined,
                ...rise(f, at, 18, 16),
              }}
            >
              <span style={{...mono, fontSize: 20, color: C.meta, width: 40}}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{position: 'relative', fontFamily: F.sans, fontSize: 38, fontWeight: 600, color: sp > 0.5 ? C.meta : C.head, letterSpacing: '-0.01em'}}>
                {t}
                {struck && (
                  <span
                    style={{
                      position: 'absolute',
                      left: -6,
                      top: '54%',
                      height: 5,
                      width: `calc(${sp * 100}% + 12px)`,
                      background: C.orange,
                    }}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: M, top: 640, width: 800, ...rise(f, q.now, 30, 22)}}>
        <div style={{width: 64, height: 5, background: C.orange, marginBottom: 30}} />
        <Body size={44} color={C.head} style={{fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.25}}>
          Now steps 2 to 5 happen on your Mac, without you.
        </Body>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 3. Name + four steps, which then dock into the rail at the top
// ---------------------------------------------------------------------------
export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const {width} = useVideoConfig();
  const q = T.cues.intro;
  const textOut = 1 - prog(f, q.dock - 6, 16);
  const dock = prog(f, q.dock, 26);
  const big = {w: 360, h: 78, gap: 18, font: 22};
  const rowW = big.w * 4 + big.gap * 3;
  const startX = (width - rowW) / 2;
  const startY = 700;
  return (
    <AbsoluteFill style={{opacity: Math.min(prog(f, 0, 8), 1)}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', opacity: textOut}}>
        <Eyebrow size={20} style={rise(f, q.title)}>
          Open source · Agent skill · MIT
        </Eyebrow>
        <H size={128} style={{marginTop: 30, ...rise(f, q.title + 4, 30)}}>
          testflight-feedback-loop
        </H>
        <Body size={38} color={C.soft} style={{marginTop: 34, ...rise(f, q.sub)}}>
          A Claude Code skill that runs the whole TestFlight loop.
          <br />
          <span style={{color: C.body}}>Drive it from your phone. Works with Codex and other agents too.</span>
        </Body>
      </div>
      {STEPS.map((s, i) => {
        const appear = prog(f, q.chips + i * 6, 16);
        const x0 = startX + i * (big.w + big.gap);
        const x1 = RAIL.x + i * (RAIL.w + RAIL.gap);
        const x = interpolate(dock, [0, 1], [x0, x1]);
        const y = interpolate(dock, [0, 1], [startY, RAIL.y]);
        const w = interpolate(dock, [0, 1], [big.w, RAIL.w]);
        const h = interpolate(dock, [0, 1], [big.h, RAIL.h]);
        const font = interpolate(dock, [0, 1], [big.font, 17]);
        return (
          <div key={s.n} style={{position: 'absolute', left: x, top: y + (1 - appear) * 24, opacity: appear}}>
            <Chip n={s.n} k={s.k} state={dock > 0.98 && i === 0 ? 'active' : 'idle'} w={w} h={h} font={font} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 10. End card
// ---------------------------------------------------------------------------
export const End: React.FC = () => {
  const f = useCurrentFrame();
  const q = T.cues.end;
  const link = (label: string, url: string, at: number) => (
    <div style={{display: 'flex', alignItems: 'baseline', gap: 28, padding: '22px 0', borderTop: `1px solid ${C.line}`, ...rise(f, at, 16)}}>
      <span style={{...mono, fontSize: 18, color: C.meta, width: 150}}>{label}</span>
      <span style={{fontFamily: F.mono, fontSize: 34, color: C.head, letterSpacing: '-0.01em'}}>{url}</span>
    </div>
  );
  return (
    <AbsoluteFill style={{opacity: prog(f, 0, 10)}}>
      <div style={{position: 'absolute', left: M, top: 200, right: M}}>
        <Eyebrow size={20} style={rise(f, q.title)}>
          Free · Open source · MIT
        </Eyebrow>
        <H size={124} style={{marginTop: 28, ...rise(f, q.title + 4, 30)}}>
          testflight-feedback-loop<Accent>.</Accent>
        </H>
        <div style={{marginTop: 70, width: 1240}}>
          {link('Get it', 'github.com/fomoPhil/testflight-feedback-loop', q.links)}
          {link('Setup', 'philwoolley.com/testflight-feedback-loop', q.links + 8)}
          <div style={{borderTop: `1px solid ${C.line}`}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
