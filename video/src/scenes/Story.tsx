import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, T, mono, prog, rise, typed} from '../theme';
import {Accent, Body, Eyebrow, H, Rail} from '../components/Brand';
import {BetaScreen, Banner, FeedbackSheet, Phone, SH, SW, Tap, TempoScreen, Toast} from '../components/Phone';
import {ChatScreen, Msg} from '../components/Chat';
import {Laptop, Line, Terminal} from '../components/Laptop';

export const PHONE = {x: 300, y: 150, s: 0.92};
export const PHONE_LEFT = 96;
const COPY_X = 860;

const FEEDBACK_TEXT = 'Start button is cut off at the bottom of the screen.';
const ASK_TEXT = 'check feedback';

const HISTORY: Msg[] = [
  {role: 'user', text: 'add a tap-tempo button', dim: true},
  {role: 'agent', text: 'Added Tap. It averages your last four taps.', dim: true},
  {role: 'user', text: 'ship to TestFlight', dim: true},
  {role: 'agent', text: 'Build 42 is live in TestFlight. Update and test.', done: true, dim: true},
];

/** Copy block that swaps cleanly between phases. */
const Copy: React.FC<{f: number; from: number; to?: number; eyebrow: string; title: React.ReactNode; body: React.ReactNode; extra?: React.ReactNode; top?: number}> = ({
  f,
  from,
  to,
  eyebrow,
  title,
  body,
  extra,
  top = 300,
}) => {
  const out = to === undefined ? 1 : 1 - prog(f, to, 10);
  if (f < from - 1 || out <= 0) return null;
  return (
    <div style={{position: 'absolute', left: COPY_X, top, width: 940, opacity: out}}>
      <Eyebrow size={20} style={rise(f, from, 14, 14)}>
        {eyebrow}
      </Eyebrow>
      <H size={78} style={{marginTop: 26, ...rise(f, from + 3, 26, 18)}}>
        {title}
      </H>
      <Body size={34} color={C.body} style={{marginTop: 30, maxWidth: 860, ...rise(f, from + 8, 20, 18)}}>
        {body}
      </Body>
      {extra}
    </div>
  );
};

// ---------------------------------------------------------------------------
// 4. Test + feedback
// ---------------------------------------------------------------------------
export const Feedback: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const q = T.cues.feedback;
  const dur = T.scenes.feedback.dur;
  const phoneIn = spring({frame: f, fps, config: {damping: 200}});
  const ring = f < q.shutter ? prog(f, q.ring, 14) : 1;
  const flash = interpolate(f, [q.shutter, q.shutter + 2, q.shutter + 14], [0, 0.9, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sheetIn = spring({frame: f - q.sheet, fps, config: {damping: 22, stiffness: 120}});
  const sheetOut = prog(f, q.sent, 14);
  const sheetY = f < q.sheet ? SH : (1 - sheetIn) * SH + sheetOut * SH;
  const text = typed(FEEDBACK_TEXT, f, q.typeFrom, q.typeTo);
  const pressed = f >= q.submit && f < q.submit + 6;
  const toast = prog(f, q.sent + 6, 10) * (1 - prog(f, dur - 30, 14));
  return (
    <AbsoluteFill style={{opacity: prog(f, 0, 8)}}>
      <Rail active={f < q.copy2 ? 0 : 1} />
      <div style={{position: 'absolute', left: PHONE.x, top: PHONE.y + (1 - phoneIn) * 160, opacity: phoneIn}}>
        <Phone scale={PHONE.s}>
          <TempoScreen ring={ring} />
          <div style={{position: 'absolute', inset: 0, background: '#000', opacity: (f >= q.sheet ? 0.45 : 0) * (1 - sheetOut), zIndex: 7}} />
          <FeedbackSheet y={sheetY} text={text} caret={f >= q.sheet + 10 && f < q.submit && Math.floor(f / 8) % 2 === 0} pressed={pressed} />
          <Toast opacity={toast} text="Feedback sent to the developer" />
          <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash, zIndex: 30}} />
          <Tap x={334} y={112} p={interpolate(f, [q.submit - 2, q.submit + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
        </Phone>
      </div>
      <Copy
        f={f}
        from={8}
        to={q.copy2 - 8}
        eyebrow="01 · Test"
        title="Test the build on your phone."
        body="Every build lands in TestFlight. Install it and use your app like anyone else would."
      />
      <Copy
        f={f}
        from={q.copy2}
        to={dur - 12}
        eyebrow="02 · Feedback"
        title={
          <>
            Spot something<Accent>?</Accent> Screenshot it.
          </>
        }
        body="TestFlight turns the screenshot into feedback, with your note, your device and the build number attached."
        extra={
          <div style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 12, ...mono, fontSize: 18, color: C.green, ...rise(f, q.sent + 8, 12, 14)}}>
            ✓ Saved in App Store Connect
          </div>
        }
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 5. Ask from the Claude app
// ---------------------------------------------------------------------------
export const Ask: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const q = T.cues.ask;
  const dur = T.scenes.ask.dur;
  const swap = spring({frame: f - q.swap, fps, config: {damping: 200}});
  const composer = f < q.send ? typed(ASK_TEXT, f, q.typeFrom, q.typeTo) : '';
  const sent = prog(f, q.send, 10);
  const working = prog(f, q.send + 14, 12);
  const msgs: Msg[] = [
    ...HISTORY,
    {role: 'user', text: ASK_TEXT, p: sent},
    {role: 'agent', text: 'Checking TestFlight for new feedback…', working: true, p: working, spin: f / 24},
  ];
  const exit = prog(f, q.exit, dur - q.exit);
  const x = interpolate(exit, [0, 1], [PHONE.x, PHONE_LEFT]);
  return (
    <AbsoluteFill>
      <Rail active={2} />
      <div style={{position: 'absolute', left: x, top: PHONE.y}}>
        <Phone scale={PHONE.s}>
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${-swap * SW}px)`}}>
            <TempoScreen ring={1} />
            <Toast opacity={1 - swap} text="Feedback sent to the developer" />
          </div>
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - swap) * SW}px)`}}>
            <ChatScreen
              messages={msgs}
              composer={composer}
              caret={f >= q.typeFrom - 10 && f < q.send && Math.floor(f / 8) % 2 === 0}
              sendPressed={f >= q.send - 2 && f < q.send + 4}
            />
          </div>
          <Tap x={355} y={SH - 63} p={interpolate(f, [q.send - 3, q.send + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
        </Phone>
      </div>
      <div style={{opacity: 1 - prog(f, q.exit - 6, 14)}}>
        <Copy
          f={f}
          from={4}
          eyebrow="03 · Ask"
          title={
            <>
              Open the Claude app. Say “check feedback<Accent>.</Accent>”
            </>
          }
          body="Remote Control connects the app to Claude Code running on your Mac at home. Same session, from anywhere."
          extra={
            <div style={{marginTop: 34, ...mono, fontSize: 18, color: C.meta, ...rise(f, 40, 12, 14)}}>
              Using Codex? Same move from the ChatGPT app.
            </div>
          }
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 6. The Mac does the work, the phone follows along
// ---------------------------------------------------------------------------
const LAP = {x: 572, y: 270, w: 1100, h: 620};

export const Work: React.FC = () => {
  const f = useCurrentFrame();
  const q = T.cues.work;
  const dur = T.scenes.work.dur;
  const enter = prog(f, 0, 26);
  const exit = prog(f, dur - 34, 30);
  const at = (c: number, d = 8) => prog(f, c, d);
  const spinner = f / 20;

  const lines: Line[] = [
    {pre: '›', text: ASK_TEXT, color: C.head, p: at(q.prompt)},
    {pre: '$', text: 'asc auth status', right: '✓ default: My Team', p: at(q.auth)},
    {pre: '$', text: 'asc testflight feedback list --app 6741023351', p: at(q.list)},
    {text: '1 new · iPhone 16 Pro · iOS 26 · build 42', color: C.body, indent: 1, right: 'NEW', rightColor: C.gold, p: at(q.listOut)},
    {text: `“${FEEDBACK_TEXT}”`, color: C.soft, indent: 1, p: at(q.listOut + 6)},
    {pre: '↳', text: 'testflight-feedback.md   #7 Start button cut off', right: '● Open', rightColor: C.gold, p: at(q.tracker)},
    {pre: '✎', text: 'TempoView.swift   .safeAreaInset(edge: .bottom)', right: '+3 −1', p: at(q.edit)},
    {pre: '✓', preColor: C.green, text: 'xcodebuild test   24 passed · 0 warnings', p: at(q.tests)},
    {pre: '$', text: 'asc builds next-build-number', right: '→ 43', rightColor: C.head, p: at(q.bump)},
    {
      pre: '==>',
      text: 'Archiving (Release)…',
      p: at(q.archive),
      ...(f < q.archiveOk ? {spin: spinner} : {right: '✓'}),
    },
    {
      pre: '==>',
      text: 'Exporting App Store IPA…',
      p: at(q.export),
      ...(f < q.exportOk ? {spin: spinner} : {right: '✓'}),
    },
    {
      pre: '==>',
      text: 'Uploading to App Store Connect…',
      p: at(q.upload),
      ...(f < q.uploadOk ? {bar: interpolate(f, [q.upload, q.uploadOk], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} : {right: '✓'}),
    },
    {
      pre: '…',
      text: 'poll_build_status.sh   build 43',
      p: at(q.poll),
      ...(f < q.valid ? {spin: spinner, right: 'PROCESSING', rightColor: C.gold} : {right: 'VALID ✓', rightColor: C.green}),
    },
    {pre: '↳', text: 'testflight-feedback.md   #7 Start button cut off', right: '✓ Fixed in 43', p: at(q.trackerFixed)},
  ];

  const msgs: Msg[] = [
    ...HISTORY,
    {role: 'user', text: ASK_TEXT},
    f < q.msg1
      ? {role: 'agent', text: 'Checking TestFlight for new feedback…', working: true, spin: f / 24}
      : {role: 'agent', text: 'Found 1 new item: the Start button is cut off on iPhone 16 Pro. Logged as #7.', p: Math.max(0.6, at(q.msg1, 10))},
    {role: 'agent', text: 'Fixed. The button sits above the home indicator now. Tests pass.', p: at(q.msg2, 10)},
    f < q.msg4
      ? {role: 'agent', text: 'Shipping build 43 to TestFlight…', working: true, spin: f / 24, p: at(q.msg3, 10)}
      : {role: 'agent', text: 'Build 43 is live in TestFlight. Update and try it.', done: true, p: 1},
  ];

  const phoneX = interpolate(exit, [0, 1], [PHONE_LEFT, PHONE.x]);
  return (
    <AbsoluteFill>
      <Rail active={3} />
      <div style={{position: 'absolute', left: phoneX, top: PHONE.y}}>
        <Phone scale={PHONE.s} glow={f >= q.msg4 && f < q.msg4 + 40}>
          <ChatScreen messages={msgs} />
        </Phone>
      </div>
      <div style={{position: 'absolute', left: LAP.x + 76, top: 150, width: 1100, opacity: enter * (1 - exit)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Eyebrow size={20}>04 · Fix + ship</Eyebrow>
          <span style={{...mono, fontSize: 15, color: C.gold, border: `1.5px solid ${C.gold}`, padding: '7px 11px'}}>No Xcode window</span>
        </div>
        <H size={52} style={{marginTop: 18}}>
          Your Mac pulls it, fixes it, ships build 43<Accent>.</Accent>
        </H>
      </div>
      <div style={{position: 'absolute', left: LAP.x + (1 - enter) * 240 + exit * 300, top: LAP.y + 34, opacity: enter * (1 - exit)}}>
        <Laptop w={LAP.w} h={LAP.h - 34}>
          <Terminal lines={lines} maxLines={13} />
        </Laptop>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 7. Update arrives on the phone
// ---------------------------------------------------------------------------
export const Update: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const q = T.cues.update;
  const dur = T.scenes.update.dur;
  const bannerIn = spring({frame: f - q.banner, fps, config: {damping: 16, stiffness: 140}});
  const toBeta = prog(f, q.tapBanner + 6, 12);
  const toApp = prog(f, q.open + 4, 9);
  const betaState: 'update' | 'loading' | 'open' = f < q.tapUpdate ? 'update' : f < q.open - 6 ? 'loading' : 'open';
  const loading = interpolate(f, [q.tapUpdate, q.open - 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fixed = prog(f, q.fixed, 14);
  const out = 1 - prog(f, dur - 14, 14);
  const tapP = (c: number) => interpolate(f, [c - 2, c + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const done: Msg[] = [
    ...HISTORY,
    {role: 'user', text: ASK_TEXT},
    {role: 'agent', text: 'Found 1 new item: the Start button is cut off on iPhone 16 Pro. Logged as #7.'},
    {role: 'agent', text: 'Fixed. The button sits above the home indicator now. Tests pass.'},
    {role: 'agent', text: 'Build 43 is live in TestFlight. Update and try it.', done: true},
  ];
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Rail active={f < q.fixed ? 0 : -1} doneUpTo={f < q.fixed ? -1 : 3} />
      <div style={{position: 'absolute', left: PHONE.x, top: PHONE.y}}>
        <Phone scale={PHONE.s}>
          <div style={{position: 'absolute', inset: 0, opacity: 1 - toBeta}}>
            <ChatScreen messages={done} />
          </div>
          <div style={{position: 'absolute', inset: 0, opacity: toBeta, transform: `translateY(${(1 - toBeta) * 40}px)`}}>
            <BetaScreen state={betaState} loading={loading} pressed={(f >= q.tapUpdate && f < q.tapUpdate + 5) || (f >= q.open && f < q.open + 5)} />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: Math.min(1, toApp * 2.5),
              transform: `scale(${0.18 + 0.82 * toApp})`,
              transformOrigin: '60px 205px',
              borderRadius: 60 * (1 - toApp),
              overflow: 'hidden',
            }}
          >
            <TempoScreen fixed build={43} fixedBadge={fixed} />
          </div>
          <Banner y={(bannerIn - 1) * 160 - toBeta * 160} opacity={Math.min(1, bannerIn) * (1 - toBeta)} pressed={f >= q.tapBanner && f < q.tapBanner + 6} />
          <Tap x={200} y={100} p={tapP(q.tapBanner)} />
          <Tap x={322} y={203} p={tapP(q.tapUpdate)} />
          <Tap x={322} y={203} p={tapP(q.open)} />
        </Phone>
      </div>
      <Copy
        f={f}
        from={10}
        top={220}
        eyebrow="Back to 01"
        title={
          <>
            Update. Test again. Done<Accent>.</Accent>
          </>
        }
        body="The fix you asked for from the couch is on your phone a few minutes later."
        extra={
          <div style={{marginTop: 46, width: 900, border: `1px solid ${C.line}`, background: C.panel, ...rise(f, q.tracker, 18, 18)}}>
            <div style={{padding: '14px 22px', borderBottom: `1px solid ${C.line}`, display: 'flex', justifyContent: 'space-between', ...mono, fontSize: 15, color: C.meta}}>
              <span>testflight-feedback.md</span>
              <span>the tracker</span>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '70px 1fr 230px 130px', alignItems: 'center', padding: '20px 22px', fontFamily: F.sans, fontSize: 25, color: C.head}}>
              <span style={{...mono, fontSize: 18, color: C.meta}}>#7</span>
              <span>Start button cut off</span>
              <span style={{color: C.green, ...mono, fontSize: 17}}>✓ Addressed</span>
              <span style={{...mono, fontSize: 17, color: C.body}}>build 43</span>
            </div>
          </div>
        }
      />
      <div style={{position: 'absolute', left: COPY_X, top: 820, width: 900, ...rise(f, q.tracker + 10, 14, 16)}}>
        <Body size={26} color={C.meta}>
          Every item is logged with the build that fixed it, so nothing gets lost or fixed twice.
        </Body>
      </div>
    </AbsoluteFill>
  );
};
