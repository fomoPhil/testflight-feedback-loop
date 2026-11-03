import React from 'react';
import {C} from '../theme';

type P = {size?: number; color?: string; stroke?: number};

const S: React.FC<P & {children: React.ReactNode; vb?: number}> = ({size = 40, color = C.head, stroke = 2, children, vb = 24}) => (
  <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const IPhone: React.FC<P> = (p) => (
  <S {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" />
    <path d="M10.5 4.6h3" />
  </S>
);

export const IChat: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M4 5.5h16v10H11l-4.5 3.5v-3.5H4z" />
    <path d="M8 9.5h8M8 12.3h5" />
  </S>
);

export const IPlane: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M21 3 3 10.5l7 2.5 2.5 7z" />
    <path d="m10 13 4.5-4.5" />
  </S>
);

export const IWrench: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M14.5 6.2a4 4 0 0 0 5.3 5.3l-1.3 1.3-7.8 7.8a2.1 2.1 0 0 1-3-3l7.8-7.8z" />
    <path d="M14.5 6.2 17.8 3a4 4 0 0 1 3 3l-3.2 3.3" />
  </S>
);

export const ITerminal: React.FC<P> = (p) => (
  <S {...p}>
    <rect x="2.5" y="4" width="19" height="16" rx="2" />
    <path d="m6.5 9.5 3 2.5-3 2.5M12 15h5" />
  </S>
);

export const ILaptop: React.FC<P> = (p) => (
  <S {...p}>
    <rect x="4" y="4.5" width="16" height="11" rx="1.4" />
    <path d="M2 19h20" />
  </S>
);

export const ICloud: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M7 18.5h10.5a4 4 0 0 0 .4-8A6 6 0 0 0 6.3 9.6 4.5 4.5 0 0 0 7 18.5z" />
  </S>
);

export const ICheck: React.FC<P> = (p) => (
  <S {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </S>
);

export const ICamera: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M4 8h3l1.6-2.5h6.8L17 8h3v11H4z" />
    <circle cx="12" cy="13.2" r="3.4" />
  </S>
);

export const IArrowR: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
  </S>
);

export const IBolt: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z" />
  </S>
);

/** App icon for the sample app in the story ("Tempo", a metronome). */
export const TempoIcon: React.FC<{size?: number; radius?: number}> = ({size = 60, radius}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: radius ?? size * 0.225,
      background: C.orange,
      display: 'grid',
      placeItems: 'center',
      flex: `0 0 ${size}px`,
    }}
  >
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6l3.5 18h-13z" />
      <path d="M12 16 16.5 6.5" />
      <path d="M7.5 15.5h9" />
    </svg>
  </div>
);

/** Generic "beta builds" icon, deliberately not Apple's TestFlight mark. */
export const BetaIcon: React.FC<{size?: number}> = ({size = 40}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.225,
      background: '#24262c',
      border: `1px solid ${C.border2}`,
      boxSizing: 'border-box',
      display: 'grid',
      placeItems: 'center',
      flex: `0 0 ${size}px`,
    }}
  >
    <IPlane size={size * 0.58} color={C.head} stroke={2} />
  </div>
);
