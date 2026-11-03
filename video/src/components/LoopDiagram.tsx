import React from 'react';
import {C, F, mono} from '../theme';
import {IChat, IPhone, IWrench, ICamera} from './Icons';

const NODES = [
  {n: '01', k: 'Test', sub: 'on your phone', Icon: IPhone, a: -90},
  {n: '02', k: 'Feedback', sub: 'screenshot + note', Icon: ICamera, a: 0},
  {n: '03', k: 'Ask', sub: '“check feedback”', Icon: IChat, a: 90},
  {n: '04', k: 'Fix + ship', sub: 'your Mac, headless', Icon: IWrench, a: 180},
];

const rad = (d: number) => (d * Math.PI) / 180;

/**
 * The four-step loop. `draw` reveals the ring, `travel` (degrees) moves the orange
 * comet around it, `active` highlights a node (or -1 for none).
 */
export const LoopDiagram: React.FC<{
  r?: number;
  draw?: number;
  travel?: number;
  active?: number;
  nodeP?: number[];
  center?: React.ReactNode;
}> = ({r = 300, draw = 1, travel, active = -1, nodeP = [1, 1, 1, 1], center}) => {
  const pad = 210;
  const S = (r + pad) * 2;
  const cx = S / 2;
  const cy = S / 2;
  const gap = 17; // degrees of gap each side of a node
  const arcs = NODES.map((nd, i) => {
    const a0 = nd.a + gap;
    const a1 = NODES[(i + 1) % 4].a + (i === 3 ? 360 : 0) - gap;
    return {a0, a1};
  });
  const arcPath = (a0: number, a1: number, rr = r) => {
    const x0 = cx + rr * Math.cos(rad(a0));
    const y0 = cy + rr * Math.sin(rad(a0));
    const x1 = cx + rr * Math.cos(rad(a1));
    const y1 = cy + rr * Math.sin(rad(a1));
    const large = a1 - a0 > 180 ? 1 : 0;
    return `M ${x0} ${y0} A ${rr} ${rr} 0 ${large} 1 ${x1} ${y1}`;
  };
  const arcLen = (2 * Math.PI * r * (90 - gap * 2)) / 360;
  return (
    <div style={{position: 'relative', width: S, height: S}}>
      <svg width={S} height={S} style={{position: 'absolute', inset: 0}}>
        {arcs.map((a, i) => {
          const local = Math.max(0, Math.min(1, draw * 4 - i));
          const end = a.a1;
          const ex = cx + r * Math.cos(rad(end));
          const ey = cy + r * Math.sin(rad(end));
          const tang = end + 90; // clockwise tangent direction
          return (
            <g key={i}>
              <path d={arcPath(a.a0, a.a1)} stroke={C.border2} strokeWidth={3} fill="none" strokeDasharray={`${arcLen * local} ${arcLen}`} />
              {local >= 1 && (
                <path
                  d={`M ${ex - 14 * Math.cos(rad(tang)) - 9 * Math.cos(rad(tang + 90))} ${ey - 14 * Math.sin(rad(tang)) - 9 * Math.sin(rad(tang + 90))} L ${ex} ${ey} L ${
                    ex - 14 * Math.cos(rad(tang)) + 9 * Math.cos(rad(tang + 90))
                  } ${ey - 14 * Math.sin(rad(tang)) + 9 * Math.sin(rad(tang + 90))}`}
                  stroke={C.border2}
                  strokeWidth={3}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </g>
          );
        })}
        {travel !== undefined && (
          <>
            <path d={arcPath(travel - 34, travel)} stroke={C.orange} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.95} />
            <circle cx={cx + r * Math.cos(rad(travel))} cy={cy + r * Math.sin(rad(travel))} r={9} fill={C.orange} />
          </>
        )}
      </svg>
      {NODES.map((nd, i) => {
        const x = cx + r * Math.cos(rad(nd.a));
        const y = cy + r * Math.sin(rad(nd.a));
        const on = i === active;
        const p = nodeP[i] ?? 1;
        const labelPos: React.CSSProperties =
          nd.a === -90
            ? {left: x - 160, width: 320, top: y - 64 - 92, textAlign: 'center'}
            : nd.a === 90
              ? {left: x - 160, width: 320, top: y + 64 + 20, textAlign: 'center'}
              : nd.a === 0
                ? {left: x + 64 + 24, width: 220, top: y - 34, textAlign: 'left'}
                : {left: x - 64 - 24 - 220, width: 220, top: y - 34, textAlign: 'right'};
        return (
          <React.Fragment key={nd.n}>
            <div
              style={{
                position: 'absolute',
                left: x - 64,
                top: y - 64,
                width: 128,
                height: 128,
                borderRadius: 64,
                background: on ? 'rgba(255,91,4,0.12)' : C.panel2,
                border: `2px solid ${on ? C.orange : C.border2}`,
                display: 'grid',
                placeItems: 'center',
                boxSizing: 'border-box',
                opacity: p,
                transform: `scale(${0.8 + 0.2 * p})`,
              }}
            >
              <nd.Icon size={54} color={on ? C.orange : C.head} stroke={1.8} />
            </div>
            <div style={{position: 'absolute', ...labelPos, opacity: p}}>
              <div style={{...mono, fontSize: 18, color: C.orange}}>{nd.n}</div>
              <div style={{fontFamily: F.sans, fontWeight: 800, fontStretch: '108%', letterSpacing: '-0.03em', fontSize: 34, color: C.head, marginTop: 4}}>{nd.k}</div>
              <div style={{fontFamily: F.sans, fontSize: 21, color: C.body, marginTop: 4}}>{nd.sub}</div>
            </div>
          </React.Fragment>
        );
      })}
      {center && (
        <div style={{position: 'absolute', left: cx - r + 90, top: cy - r + 90, width: (r - 90) * 2, height: (r - 90) * 2, display: 'grid', placeItems: 'center', textAlign: 'center'}}>
          {center}
        </div>
      )}
    </div>
  );
};
