import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F, T, display, envelope, mono, prog, rise} from '../theme';
import {Body, Eyebrow, H} from '../components/Brand';
import {LoopDiagram} from '../components/LoopDiagram';
import {ICheck} from '../components/Icons';

const M = 96;

// ---------------------------------------------------------------------------
// 8. The loop, spinning
// ---------------------------------------------------------------------------
export const Loop: React.FC = () => {
  const f = useCurrentFrame();
  const q = T.cues.loop;
  const dur = T.scenes.loop.dur;
  const draw = prog(f, q.draw, 34);
  const t = Math.max(0, f - 24);
  const travel = -90 + (t / q.lap) * 360;
  const lapIndex = Math.floor((t + q.lap * 0.0) / q.lap);
  const build = 43 + lapIndex;
  // active node = the last node the comet passed
  const norm = (((travel + 90) % 360) + 360) % 360;
  const active = f < 24 ? -1 : Math.floor(norm / 90);
  const nodeP = [0, 1, 2, 3].map((i) => prog(f, 4 + i * 6, 14));
  return (
    <AbsoluteFill style={{opacity: envelope(f, dur, 10, 14)}}>
      <div style={{position: 'absolute', left: 230, top: 30, transform: 'scale(0.98)', transformOrigin: 'top left'}}>
        <LoopDiagram
          r={250}
          draw={draw}
          travel={f >= 24 ? travel : undefined}
          active={active}
          nodeP={nodeP}
          center={
            <div style={{opacity: prog(f, 20, 14)}}>
              <div style={{...mono, fontSize: 18, color: C.meta}}>build</div>
              <div style={{...display, fontSize: 132, marginTop: 6}}>{build}</div>
            </div>
          }
        />
      </div>
      <div style={{position: 'absolute', left: 1290, top: 330, width: 560}}>
        <Eyebrow size={20} style={rise(f, 10)}>
          Repeat
        </Eyebrow>
        <H size={84} style={{marginTop: 26, ...rise(f, 14, 26)}}>
          Ship. Test. Fix. From anywhere.
        </H>
        <Body size={32} style={{marginTop: 30, ...rise(f, 22)}}>
          Couch, kitchen, train. If your phone has signal, your app keeps getting better.
        </Body>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 9. What you need
// ---------------------------------------------------------------------------
export const NEEDS: {k: string; items: string[]}[] = [
  {
    k: 'On your Mac',
    items: ['Xcode, signed in to your Apple ID', 'Claude Code, with Remote Control on', 'asc CLI + an App Store Connect API key', 'This skill in ~/.claude/skills'],
  },
  {
    k: 'With Apple',
    items: ['Apple Developer Program membership', 'Your app set up in App Store Connect', 'You, added as an internal tester'],
  },
  {
    k: 'On your phone',
    items: ['TestFlight', 'The Claude app (or ChatGPT, for Codex)', 'Your Mac left awake and online'],
  },
];

export const Needs: React.FC = () => {
  const f = useCurrentFrame();
  const q = T.cues.needs;
  const dur = T.scenes.needs.dur;
  let k = 0;
  return (
    <AbsoluteFill style={{opacity: envelope(f, dur, 10, 14)}}>
      <div style={{position: 'absolute', left: M, top: 130}}>
        <Eyebrow size={20} style={rise(f, q.head)}>
          Before you start
        </Eyebrow>
        <H size={80} style={{marginTop: 24, ...rise(f, q.head + 4, 26)}}>
          Set it up once. Then it’s just your phone.
        </H>
      </div>
      <div style={{position: 'absolute', left: M, right: M, top: 380, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
        {NEEDS.map((col, ci) => (
          <div key={col.k} style={{border: `1px solid ${C.line}`, background: C.panel, ...rise(f, q.items - 10 + ci * 6, 20, 18)}}>
            <div style={{padding: '18px 26px', borderBottom: `1px solid ${C.line}`, ...mono, fontSize: 17, color: C.orange}}>{col.k}</div>
            <div style={{padding: '8px 26px 18px'}}>
              {col.items.map((it) => {
                const at = q.items + k++ * q.itemGap;
                const p = prog(f, at, 12);
                return (
                  <div key={it} style={{display: 'flex', gap: 16, alignItems: 'flex-start', padding: '15px 0', opacity: interpolate(p, [0, 1], [0.25, 1])}}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        flex: '0 0 28px',
                        border: `1.5px solid ${p > 0.5 ? C.green : C.border2}`,
                        background: p > 0.5 ? 'rgba(75,214,160,0.12)' : 'transparent',
                        display: 'grid',
                        placeItems: 'center',
                        marginTop: 2,
                      }}
                    >
                      {p > 0.5 && <ICheck size={18} color={C.green} stroke={3} />}
                    </div>
                    <span style={{fontFamily: F.sans, fontSize: 27, lineHeight: 1.3, color: C.head}}>{it}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: M, top: 900, ...mono, fontSize: 19, color: C.meta, ...rise(f, q.items + 90, 12, 14)}}>
        Full setup guide <span style={{color: C.orange}}>→</span> <span style={{color: C.head}}>philwoolley.com/testflight-feedback-loop</span>
      </div>
    </AbsoluteFill>
  );
};
