import type { Theme } from '../store/app';

/** Couleurs de la scène par thème (alignées sur src/styles/tokens.css). */
export const PALETTE: Record<
  Theme,
  { body: string; screen: string; ink: string; muted: string; edge: string }
> = {
  light: { body: '#ffffff', screen: '#e9edf2', ink: '#1c2533', muted: '#6a7687', edge: '#c9d1db' },
  dark: { body: '#2b374b', screen: '#141c28', ink: '#eef2f6', muted: '#8493a8', edge: '#3d4c66' },
};

export const COLORS = {
  accent: '#ff6b2c',
  signal: '#2bc4d8',
  ack: '#3dbe7a',
};

/** Dimensions d'un « client » (écran flottant), en unités monde. */
export const SCREEN = { w: 2.6, h: 1.66, d: 0.07, radius: 0.06, pad: 0.16 };

export const CAMERA = { fov: 30, z: 12 };

/** Typo monospace des écrans. */
export const CODE = { size: 0.105, line: 0.19, advance: 0.6 };

/** Nombre de paquets dans le flux continu. */
export const STREAM_COUNT = 44;

/** Durée du trajet d'un paquet d'état de A vers B (secondes). */
export const PACKET_TRAVEL = 0.75;
