import type { Theme } from '../../store/app';
import { Vector3 } from 'three';

/** Projecteur principal (tungstène) : au plafond, côté public, braqué sur la batterie. */
export const KEY_LIGHT = {
  position: new Vector3(1.25, 3.1, 1.75),
  target: new Vector3(0, 0.5, -0.15),
};

/** Contre-jour sarcelle derrière la batterie, pour détacher chromes et cymbales du fond. */
export const RIM_LIGHT = {
  position: new Vector3(-2.3, 2.7, -2.3),
  target: new Vector3(0.1, 0.8, 0),
};

/** Dimensions du studio (mètres). Le batteur est en -Z, le public (caméra) en +Z. */
export const ROOM = { back: -2.8, side: 3.6, ceiling: 3.2 };

export const ROOM_COLORS: Record<
  Theme,
  { wall: string; foam: string; ceiling: string; led: string }
> = {
  dark: { wall: '#2b0c12', foam: '#55161f', ceiling: '#120507', led: '#ff8a2a' },
  light: { wall: '#cdb5a6', foam: '#a46e66', ceiling: '#e4d4c6', led: '#ffb066' },
};
