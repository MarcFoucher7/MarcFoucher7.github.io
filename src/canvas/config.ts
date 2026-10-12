import type { SectionId, Theme } from '../store/app';

export const CAMERA = { fov: 35, z: 10 };

/** Nombre de particules générées (le mode « low » n'en affiche qu'une partie). */
export function particleCount(mobile: boolean): number {
  return mobile ? 8000 : 16000;
}

/** Part des particules affichées en qualité réduite. */
export const LOW_QUALITY_RATIO = 0.55;

/** Index de forme par section : 0 globe, 1 vague, 2 D20, 3 champ, 4 anneau. */
export const SHAPE_FOR_SECTION: Record<SectionId, number> = {
  hero: 0,
  intro: 1,
  stage: 2,
  projects: 3,
  skills: 3,
  background: 3,
  beyond: 3,
  contact: 4,
};

interface Placement {
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

/** Position du nuage par section (unités monde), desktop puis mobile. */
export const PLACEMENT: Record<SectionId, { desktop: Placement; mobile: Placement }> = {
  hero: {
    desktop: { x: 2.1, y: 0.35, scale: 1, opacity: 1 },
    mobile: { x: 0, y: 1.05, scale: 0.62, opacity: 1 },
  },
  intro: {
    desktop: { x: 0, y: -1.2, scale: 1, opacity: 0.9 },
    mobile: { x: 0, y: -1.6, scale: 0.6, opacity: 0.7 },
  },
  stage: {
    desktop: { x: 2.5, y: -0.1, scale: 0.95, opacity: 1 },
    mobile: { x: 0, y: 1.6, scale: 0.5, opacity: 0.45 },
  },
  projects: {
    desktop: { x: 0, y: 0, scale: 1, opacity: 0.55 },
    mobile: { x: 0, y: 0, scale: 0.7, opacity: 0.4 },
  },
  skills: {
    desktop: { x: 0, y: 0, scale: 1, opacity: 0.55 },
    mobile: { x: 0, y: 0, scale: 0.7, opacity: 0.4 },
  },
  background: {
    desktop: { x: 0, y: 0, scale: 1, opacity: 0.45 },
    mobile: { x: 0, y: 0, scale: 0.7, opacity: 0.35 },
  },
  beyond: {
    desktop: { x: 0, y: 0, scale: 1, opacity: 0.45 },
    mobile: { x: 0, y: 0, scale: 0.7, opacity: 0.35 },
  },
  contact: {
    desktop: { x: 2.3, y: 0.2, scale: 1, opacity: 1 },
    mobile: { x: 0, y: 1.3, scale: 0.6, opacity: 0.8 },
  },
};

/** Couleurs des particules par thème. */
export const PARTICLE_COLORS: Record<
  Theme,
  { base: string; accent: string; size: number; additive: boolean }
> = {
  dark: { base: '#eeede8', accent: '#ff5b1f', size: 2.1, additive: true },
  light: { base: '#0c0d10', accent: '#ff5b1f', size: 2.3, additive: false },
};
