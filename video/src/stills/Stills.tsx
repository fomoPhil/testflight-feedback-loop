import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, T, display, mono} from '../theme';
import {Work} from '../scenes/Story';
import {Accent, Body, Chip, Eyebrow, Footer, H, STEPS} from '../components/Brand';
import {FeedbackSheet, Phone, PW, PH, TempoScreen, Banner} from '../components/Phone';
import {ChatScreen, Msg} from '../components/Chat';
import {Laptop, Line, Terminal} from '../components/Laptop';
import {ICloud, IArrowR} from '../components/Icons';

const DONE_CHAT: Msg[] = [
  {role: 'user', text: 'add a tap-tempo button', dim: true},
  {role: 'agent', text: 'Added Tap. It averages your last four taps.', dim: true},
  {role: 'user', text: 'ship to TestFlight', dim: true},
  {role: 'agent', text: 'Build 42 is live in TestFlight. Update and test.', done: true, dim: true},
  {role: 'user', text: 'check feedback'},
  {role: 'agent', text: 'Found 1 new item: the Start button is cut off on iPhone 16 Pro. Logged as #7.'},
  {role: 'agent', text: 'Fixed. The button sits above the home indicator now. Tests pass.'},
  {role: 'agent', text: 'Build 43 is live in TestFlight. Update and try it.', done: true},
];

const TERM_LINES: Line[] = [
  {pre: '›', text: 'check feedback', color: C.head},
  {pre: '$', text: 'asc auth status', right: '✓'},
  {pre: '$', text: 'testflight feedback', right: '1 new', rightColor: C.gold},
  {pre: '↳', text: 'tracker #7', right: '● Open', rightColor: C.gold},
  {pre: '✎', text: 'TempoView.swift', right: '+3 −1'},
  {pre: '✓', preColor: C.green, text: 'tests · 0 warnings'},
  {pre: '$', text: 'next build number', right: '→ 43', rightColor: C.head},
  {pre: '==>', text: 'archive', right: '✓'},
  {pre: '==>', text: 'export IPA', right: '✓'},
  {pre: '==>', text: 'upload', right: '✓'},
  {pre: '…', text: 'build 43', right: 'VALID ✓'},
  {pre: '↳', text: 'tracker #7', right: '✓ Fixed'},
];

// ---------------------------------------------------------------------------
// README hero banner
// ---------------------------------------------------------------------------
export const Hero: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <div style={{position: 'absolute', left: 80, top: 92, width: 760}}>
      <Eyebrow size={17}>Open source · Claude Code skill</Eyebrow>
      <H size={92} style={{marginTop: 26, lineHeight: 0.98}}>
        Fix your iPhone app from your iPhone<Accent>.</Accent>
      </H>
      <Body size={27} color={C.soft} style={{marginTop: 30, maxWidth: 700}}>
        Send TestFlight feedback. Tell Claude “check feedback.” Your Mac fixes it and ships the next build.
      </Body>
      <div style={{display: 'flex', gap: 10, marginTop: 44}}>
        {STEPS.map((s, i) => (
          <Chip key={s.n} n={s.n} k={s.k} state={i === 2 ? 'active' : 'idle'} w={i === 3 ? 196 : 168} h={46} font={14} />
        ))}
      </div>
    </div>
    <div style={{position: 'absolute', left: 880, top: 150, width: 380, height: 500, border: `1px solid ${C.line}`, overflow: 'hidden', boxShadow: '0 40px 80px -30px rgba(0,0,0,0.8)'}}>
      <Terminal lines={TERM_LINES} font={15} title="your Mac" style={{paddingRight: 70}} />
    </div>
    <div style={{position: 'absolute', left: 1180, top: 56}}>
      <Phone scale={0.74} glow>
        <ChatScreen messages={DONE_CHAT} />
      </Phone>
    </div>
    <Footer scale={0.86} pad={80} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// The loop, as four frames
// ---------------------------------------------------------------------------
const MiniPhone: React.FC<{children: React.ReactNode}> = ({children}) => <Phone scale={0.42}>{children}</Phone>;

export const TheLoop: React.FC<{bare?: boolean}> = ({bare = false}) => {
  const colW = 330;
  const xs = [80, 460, 840, 1220];
  const top = 210;
  const mh = PH * 0.42;
  const cols = [
    {
      n: '01',
      k: 'Test',
      sub: 'Install the build from TestFlight and use it.',
      art: (
        <MiniPhone>
          <TempoScreen ring={1} />
        </MiniPhone>
      ),
    },
    {
      n: '02',
      k: 'Feedback',
      sub: 'Screenshot the problem, add a note, send.',
      art: (
        <MiniPhone>
          <TempoScreen ring={1} />
          <div style={{position: 'absolute', inset: 0, background: '#000', opacity: 0.45, zIndex: 7}} />
          <FeedbackSheet y={0} text="Start button is cut off at the bottom of the screen." />
        </MiniPhone>
      ),
    },
    {
      n: '03',
      k: 'Ask',
      sub: 'Open the Claude app and say “check feedback.”',
      art: (
        <MiniPhone>
          <ChatScreen
            messages={[
              {role: 'user', text: 'check feedback'},
              {role: 'agent', text: 'Checking TestFlight for new feedback…', working: true, spin: 0.1},
            ]}
          />
        </MiniPhone>
      ),
    },
    {
      n: '04',
      k: 'Fix + ship',
      sub: 'Your Mac fixes it and uploads the next build.',
      art: (
        <div style={{width: colW, height: mh, border: `1px solid ${C.line}`, position: 'relative', overflow: 'hidden'}}>
          <Terminal lines={TERM_LINES.slice(1)} font={13} title="your Mac" />
        </div>
      ),
    },
  ];
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {!bare && (
        <div style={{position: 'absolute', left: 80, top: 64, right: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div>
            <Eyebrow size={17}>How the loop works</Eyebrow>
            <H size={58} style={{marginTop: 16}}>
              One loop. You never leave your phone<Accent>.</Accent>
            </H>
          </div>
        </div>
      )}
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${bare ? -170 : 0}px)`}}>
      {cols.map((c, i) => (
        <div key={c.n} style={{position: 'absolute', left: xs[i], top, width: colW}}>
          <div style={{height: mh, display: 'flex', justifyContent: 'center'}}>{c.art}</div>
          <div style={{marginTop: 26, borderTop: `1px solid ${C.line}`, paddingTop: 16}}>
            <div style={{...mono, fontSize: 15, color: C.orange}}>{c.n}</div>
            <div style={{...display, fontSize: 32, marginTop: 8, letterSpacing: '-0.03em'}}>{c.k}</div>
            <Body size={18} style={{marginTop: 8}}>
              {c.sub}
            </Body>
          </div>
          {i < 3 && (
            <div style={{position: 'absolute', left: colW + 4, top: mh / 2 - 21}}>
              <IArrowR size={42} color={C.border2} stroke={1.6} />
            </div>
          )}
        </div>
      ))}
      {/* return path: step 4 back to step 1 */}
      <svg width={1600} height={900} style={{position: 'absolute', inset: 0}}>
        <path d="M 1385 742 L 1385 770 L 245 770 L 245 750" stroke={C.orange} strokeWidth={2.5} fill="none" strokeDasharray="7 7" />
        <path d="M 236 758 L 245 744 L 254 758" stroke={C.orange} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 757, display: 'flex', justifyContent: 'center'}}>
        <span style={{background: C.bg, padding: '0 16px', ...mono, fontSize: 15, color: C.head}}>
          <span style={{color: C.orange}}>↺</span> build 43 shows up in TestFlight. Repeat.
        </span>
      </div>
      </div>
      {!bare && <Footer scale={0.86} pad={80} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Architecture: phone <-> Mac <-> App Store Connect
// ---------------------------------------------------------------------------
const Box: React.FC<{x: number; y: number; w: number; h: number; children: React.ReactNode; accent?: boolean}> = ({x, y, w, h, children, accent}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, border: `1.5px solid ${accent ? C.orange : C.line}`, background: C.panel, boxSizing: 'border-box'}}>{children}</div>
);

const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; color?: string; dash?: boolean}> = ({x1, y1, x2, y2, color = C.border2, dash}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 12;
  const p1 = [x2 - h * Math.cos(a - 0.5), y2 - h * Math.sin(a - 0.5)];
  const p2 = [x2 - h * Math.cos(a + 0.5), y2 - h * Math.sin(a + 0.5)];
  return (
    <g>
      <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={color} strokeWidth={2.5} strokeDasharray={dash ? '7 7' : undefined} />
      <path d={`M ${p1[0]} ${p1[1]} L ${x2} ${y2} L ${p2[0]} ${p2[1]}`} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

const Tag: React.FC<{x: number; y: number; children: React.ReactNode; color?: string; align?: 'left' | 'center' | 'right'; w?: number}> = ({x, y, children, color = C.body, align = 'center', w = 300}) => (
  <div style={{position: 'absolute', left: align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, top: y, width: w, textAlign: align, ...mono, letterSpacing: '0.1em', fontSize: 14, lineHeight: 1.5, color}}>
    {children}
  </div>
);

export const HowItConnects: React.FC<{bare?: boolean}> = ({bare = false}) => {
  const phone = {x: 80, y: 196, s: 0.56};
  const pw = PW * phone.s;
  const ph = PH * phone.s;
  // Laptop outer box = w + 32 (bezel) + 120 (base overhang); screen body starts 60px in.
  const mac = {x: 534, y: 236, w: 400, h: 290};
  const macL = mac.x;
  const macR = mac.x + mac.w + 32 + 120;
  const asc = {x: 1262, y: 250, w: 258, h: 262};
  const gapA = (phone.x + pw + macL) / 2;
  const gapB = (macR + asc.x) / 2;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {!bare && (
        <div style={{position: 'absolute', left: 80, top: 64}}>
          <Eyebrow size={17}>Under the hood</Eyebrow>
          <H size={58} style={{marginTop: 16}}>
            Your phone talks. Your Mac does the work<Accent>.</Accent>
          </H>
        </div>
      )}
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${bare ? -166 : 0}px)`}}>
      {/* phone */}
      <div style={{position: 'absolute', left: phone.x, top: phone.y}}>
        <Phone scale={phone.s}>
          <ChatScreen messages={DONE_CHAT} />
          <Banner y={0} opacity={1} />
        </Phone>
      </div>
      <Tag x={phone.x + pw / 2} y={phone.y + ph + 20} color={C.head} w={300}>
        Your phone
        <br />
        <span style={{color: C.meta}}>Claude app + TestFlight</span>
      </Tag>
      {/* mac */}
      <div style={{position: 'absolute', left: mac.x, top: mac.y}}>
        <Laptop w={mac.w} h={mac.h}>
          <div style={{position: 'absolute', inset: 0, padding: '18px 24px', background: '#0e0f11'}}>
            {[
              ['Claude Code', '+ this skill'],
              ['xcodebuild', 'headless'],
              ['asc CLI', 'App Store Connect'],
              ['tracker', 'testflight-feedback.md'],
            ].map(([a, b], i) => (
              <div key={a} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '15px 0', borderTop: i ? `1px solid ${C.line}` : undefined}}>
                <span style={{fontFamily: F.mono, fontSize: 19, color: i === 0 ? C.orange : C.head}}>{a}</span>
                <span style={{fontFamily: F.sans, fontSize: 15, color: C.meta}}>{b}</span>
              </div>
            ))}
          </div>
        </Laptop>
      </div>
      <Tag x={mac.x + 60 + (mac.w + 32) / 2} y={mac.y + mac.h + 32 + 52} color={C.head} w={380}>
        Your Mac, at home
        <br />
        <span style={{color: C.meta}}>awake, online, no Xcode window</span>
      </Tag>
      {/* App Store Connect */}
      <Box x={asc.x} y={asc.y} w={asc.w} h={asc.h}>
        <div style={{padding: '18px 20px', borderBottom: `1px solid ${C.line}`}}>
          <ICloud size={30} color={C.head} stroke={1.7} />
          <div style={{fontFamily: F.sans, fontWeight: 800, fontStretch: '108%', fontSize: 21, color: C.head, letterSpacing: '-0.02em', marginTop: 8}}>App Store Connect</div>
        </div>
        {['TestFlight feedback', 'Crash reports', 'Builds'].map((t) => (
          <div key={t} style={{padding: '13px 20px', borderBottom: `1px solid ${C.line2}`, fontFamily: F.sans, fontSize: 17, color: C.soft}}>
            {t}
          </div>
        ))}
      </Box>
      <svg width={1600} height={900} style={{position: 'absolute', inset: 0}}>
        {/* phone -> mac */}
        <Arrow x1={phone.x + pw + 18} y1={330} x2={macL + 40} y2={330} color={C.orange} />
        {/* mac -> phone */}
        <Arrow x1={macL + 40} y1={450} x2={phone.x + pw + 18} y2={450} />
        {/* asc -> mac */}
        <Arrow x1={asc.x - 16} y1={330} x2={macR - 40} y2={330} />
        {/* mac -> asc */}
        <Arrow x1={macR - 40} y1={450} x2={asc.x - 16} y2={450} color={C.orange} />
        {/* asc -> phone, the long way round */}
        <path
          d={`M ${asc.x + asc.w / 2} ${asc.y + asc.h + 14} L ${asc.x + asc.w / 2} 810 L ${phone.x + pw / 2} 810 L ${phone.x + pw / 2} ${phone.y + ph + 74}`}
          stroke={C.green}
          strokeWidth={2.5}
          fill="none"
          strokeDasharray="7 7"
        />
        <path
          d={`M ${phone.x + pw / 2 - 9} ${phone.y + ph + 86} L ${phone.x + pw / 2} ${phone.y + ph + 74} L ${phone.x + pw / 2 + 9} ${phone.y + ph + 86}`}
          stroke={C.green}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <Tag x={gapA + 10} y={262} color={C.head} w={200}>
        “check
        <br />
        feedback”
      </Tag>
      <Tag x={gapA + 10} y={466} w={200}>
        progress +
        <br />
        a summary
      </Tag>
      <Tag x={gapB - 10} y={262} w={170}>
        feedback
        <br />+ crashes
      </Tag>
      <Tag x={gapB - 10} y={466} color={C.head} w={170}>
        upload
        <br />
        build 43
      </Tag>
      <div style={{position: 'absolute', left: 0, right: 0, top: 798, display: 'flex', justifyContent: 'center'}}>
        <span style={{background: C.bg, padding: '0 16px', ...mono, letterSpacing: '0.1em', fontSize: 14, color: C.green}}>build 43 is ready in TestFlight</span>
      </div>
      </div>
      {!bare && <Footer scale={0.86} pad={80} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Video poster (site <video poster>) and README thumbnail (with a play badge)
// ---------------------------------------------------------------------------
/** Phone + terminal, right after the build goes VALID. */
export const POSTER_FRAME = T.cues.work.trackerFixed + 8;

export const Poster: React.FC<{play?: boolean}> = ({play = false}) => (
  <AbsoluteFill style={{background: C.bg}}>
    {/* rendered at frame POSTER_FRAME of a composition as long as the Work scene */}
    <Work />
    {play && (
      <>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(19,20,23,0.38)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
          <div style={{width: 168, height: 168, borderRadius: 84, background: C.orange, display: 'grid', placeItems: 'center', boxShadow: '0 30px 80px -20px rgba(255,91,4,0.6)'}}>
            <svg width="58" height="64" viewBox="0 0 34 38">
              <path d="M6 3 L32 19 L6 35 Z" fill={C.ink} />
            </svg>
          </div>
          <span style={{...mono, fontSize: 26, color: C.head, background: C.bg, padding: '10px 18px', border: `1px solid ${C.border2}`}}>Watch the explainer · 1:20</span>
        </div>
      </>
    )}
    <Footer />
  </AbsoluteFill>
);

export const OG: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <div style={{position: 'absolute', left: 64, top: 70, width: 700}}>
      <Eyebrow size={16}>Open source · Claude Code skill</Eyebrow>
      <H size={70} style={{marginTop: 22, lineHeight: 0.98}}>
        Fix your iPhone app from your iPhone<Accent>.</Accent>
      </H>
      <Body size={23} color={C.soft} style={{marginTop: 24, maxWidth: 600}}>
        TestFlight feedback in. Fixed build out.
      </Body>
    </div>
    <div style={{position: 'absolute', left: 820, top: 46}}>
      <Phone scale={0.58} glow>
        <ChatScreen messages={DONE_CHAT} />
      </Phone>
    </div>
    <Footer scale={0.8} pad={64} />
  </AbsoluteFill>
);

export const PosterPlay: React.FC = () => <Poster play />;

export const TheLoopBare: React.FC = () => <TheLoop bare />;
export const HowItConnectsBare: React.FC = () => <HowItConnects bare />;
