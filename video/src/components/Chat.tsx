import React from 'react';
import {C, F, mono} from '../theme';
import {StatusBar} from './Phone';
import {ICheck} from './Icons';

export type Msg = {
  role: 'user' | 'agent';
  text: string;
  /** entrance progress 0..1 */
  p?: number;
  working?: boolean;
  done?: boolean;
  dim?: boolean;
  /** spinner phase, 0..1 */
  spin?: number;
};

/**
 * The Claude mobile app connected to Claude Code on a Mac through Remote Control.
 * Drawn as an illustration in the site's palette, not a pixel copy of the real UI.
 */
export const ChatScreen: React.FC<{messages: Msg[]; composer?: string; caret?: boolean; sendPressed?: boolean; title?: string}> = ({
  messages,
  composer = '',
  caret = false,
  sendPressed = false,
  title = 'tempo-app',
}) => (
  <div style={{position: 'absolute', inset: 0, background: C.bg}}>
    <StatusBar />
    {/* header */}
    <div
      style={{
        position: 'absolute',
        top: 54,
        left: 0,
        right: 0,
        height: 74,
        borderBottom: `1px solid ${C.line}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 18px',
        gap: 12,
        background: C.bg,
        zIndex: 4,
      }}
    >
      <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke={C.soft} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2 2 10l8 8" />
      </svg>
      <div style={{flex: 1}}>
        <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 19, color: C.head}}>{title}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 7, marginTop: 3, ...mono, letterSpacing: '0.08em', fontSize: 11, color: C.meta}}>
          <span style={{width: 8, height: 8, borderRadius: 4, background: C.green, display: 'inline-block'}} />
          MacBook Pro · Remote Control
        </div>
      </div>
      <div style={{...mono, fontSize: 10, color: C.meta, border: `1px solid ${C.border}`, padding: '5px 7px'}}>Code</div>
    </div>

    {/* messages, bottom-anchored so new ones push older ones up */}
    <div
      style={{
        position: 'absolute',
        top: 128,
        left: 0,
        right: 0,
        bottom: 104,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 18px 14px',
        gap: 18,
        overflow: 'hidden',
      }}
    >
      {messages.map((m, i) => {
        const p = m.p ?? 1;
        if (p <= 0) return null;
        const base: React.CSSProperties = {
          opacity: p * (m.dim ? 0.42 : 1),
          transform: `translateY(${(1 - p) * 14}px)`,
          maxHeight: p < 1 ? 400 * p + 40 : undefined,
        };
        if (m.role === 'user') {
          return (
            <div key={i} style={{...base, alignSelf: 'flex-end', maxWidth: '78%'}}>
              <div
                style={{
                  background: '#2a2c31',
                  color: C.head,
                  borderRadius: '20px 20px 6px 20px',
                  padding: '12px 16px',
                  fontFamily: F.sans,
                  fontSize: 19.5,
                  lineHeight: 1.35,
                }}
              >
                {m.text}
              </div>
            </div>
          );
        }
        return (
          <div key={i} style={{...base, alignSelf: 'stretch'}}>
            <div style={{...mono, fontSize: 10, color: C.meta, marginBottom: 6}}>Claude</div>
            <div style={{display: 'flex', gap: 10, alignItems: 'flex-start'}}>
              {m.done && (
                <div style={{width: 24, height: 24, borderRadius: 12, background: C.green, display: 'grid', placeItems: 'center', flex: '0 0 24px', marginTop: 1}}>
                  <ICheck size={15} color={C.ink} stroke={3.2} />
                </div>
              )}
              {m.working && (
                <svg width="22" height="22" viewBox="0 0 22 22" style={{flex: '0 0 22px', marginTop: 2, transform: `rotate(${(m.spin ?? 0) * 360}deg)`}}>
                  <circle cx="11" cy="11" r="8" stroke={C.border2} strokeWidth="3" fill="none" />
                  <path d="M11 3a8 8 0 0 1 8 8" stroke={C.orange} strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              )}
              <div style={{fontFamily: F.sans, fontSize: 19.5, lineHeight: 1.4, color: m.done ? C.head : C.soft}}>{m.text}</div>
            </div>
          </div>
        );
      })}
    </div>

    {/* composer */}
    <div style={{position: 'absolute', left: 14, right: 14, bottom: 34, height: 58, display: 'flex', gap: 10, alignItems: 'center'}}>
      <div
        style={{
          flex: 1,
          height: 52,
          borderRadius: 26,
          border: `1px solid ${composer ? C.border2 : C.border}`,
          background: C.panel2,
          display: 'flex',
          alignItems: 'center',
          padding: '0 18px',
          fontFamily: F.sans,
          fontSize: 18,
          color: composer ? C.head : C.meta,
        }}
      >
        {composer || 'Reply to Claude'}
        {caret && <span style={{display: 'inline-block', width: 2, height: 22, background: C.orange, marginLeft: 2}} />}
      </div>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          background: composer ? C.orange : C.border,
          display: 'grid',
          placeItems: 'center',
          transform: `scale(${sendPressed ? 0.88 : 1})`,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={composer ? C.ink : C.meta} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 15V3M3.5 8.5 9 3l5.5 5.5" />
        </svg>
      </div>
    </div>
  </div>
);
