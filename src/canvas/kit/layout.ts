import type { PieceId } from '../../kit/ids';

export type Vec3 = [number, number, number];

export interface DrumShape {
  kind: 'drum';
  radius: number;
  depth: number;
  lugs: number;
  woodHoop?: boolean;
  dot?: boolean;
}

export interface CymbalShape {
  kind: 'cymbal';
  radius: number;
  bell: number;
  bow: number;
}

export interface HiHatShape {
  kind: 'hihat';
  radius: number;
}

export interface PieceSpec {
  shape: DrumShape | CymbalShape | HiHatShape;
  /** Position monde du centre de la pièce. */
  position: Vec3;
  /** Rotation (Euler XYZ). Le batteur est assis en -Z et regarde vers +Z. */
  rotation: Vec3;
  /** Déplacement monde à 100 % de la vue éclatée. */
  explode: Vec3;
  /** Point d'accroche de l'étiquette, relatif à la pièce (monde). */
  label: Vec3;
  /** Amplitude de l'oscillation après une frappe (radians). */
  wobble: number;
}

/**
 * Implantation d'une batterie 5 fûts réaliste (dimensions en mètres) :
 * grosse caisse 22", caisse claire 14", toms 10" et 12", tom basse 16",
 * charleston 14", crash 18", ride 20".
 */
export const PIECES: Record<PieceId, PieceSpec> = {
  kick: {
    shape: { kind: 'drum', radius: 0.28, depth: 0.41, lugs: 10, woodHoop: true },
    position: [0, 0.29, 0.02],
    rotation: [Math.PI / 2, 0, 0],
    explode: [0, 0.02, 0.34],
    label: [0, 0.36, 0.12],
    wobble: 0.012,
  },
  snare: {
    shape: { kind: 'drum', radius: 0.178, depth: 0.14, lugs: 10, dot: true },
    position: [0.33, 0.64, -0.33],
    rotation: [-0.14, 0, 0.07],
    explode: [0.36, 0.5, 0.04],
    label: [0, 0.2, 0],
    wobble: 0.03,
  },
  tom1: {
    shape: { kind: 'drum', radius: 0.127, depth: 0.2, lugs: 6 },
    position: [0.18, 0.8, 0.04],
    rotation: [-0.45, 0, 0.16],
    explode: [0.16, 0.66, 0.18],
    label: [0, 0.2, 0],
    wobble: 0.035,
  },
  tom2: {
    shape: { kind: 'drum', radius: 0.152, depth: 0.23, lugs: 6 },
    position: [-0.19, 0.82, 0.06],
    rotation: [-0.45, 0, -0.16],
    explode: [-0.2, 0.7, 0.18],
    label: [0, 0.22, 0],
    wobble: 0.035,
  },
  floor: {
    shape: { kind: 'drum', radius: 0.203, depth: 0.4, lugs: 8 },
    position: [-0.6, 0.41, -0.3],
    rotation: [-0.06, 0, -0.05],
    explode: [-0.5, 0.42, 0],
    label: [0, 0.32, 0],
    wobble: 0.025,
  },
  hihat: {
    shape: { kind: 'hihat', radius: 0.178 },
    position: [0.68, 0.95, -0.45],
    rotation: [0, 0, 0.05],
    explode: [0.52, 0.44, -0.08],
    label: [0, 0.18, 0],
    wobble: 0.06,
  },
  crash: {
    shape: { kind: 'cymbal', radius: 0.229, bell: 0.06, bow: 0.024 },
    position: [0.56, 1.27, 0.12],
    rotation: [-0.38, 0, 0.3],
    explode: [0.42, 0.52, 0.22],
    label: [0, 0.16, 0],
    wobble: 0.16,
  },
  ride: {
    shape: { kind: 'cymbal', radius: 0.254, bell: 0.075, bow: 0.026 },
    position: [-0.8, 1.1, 0.02],
    rotation: [-0.25, 0, -0.3],
    explode: [-0.56, 0.48, 0.2],
    label: [0, 0.16, 0],
    wobble: 0.1,
  },
};

/** Pieds et accessoires fixes (restent au sol dans la vue éclatée). */
export const STANDS = {
  snare: { base: [0.33, 0, -0.33] as Vec3, height: 0.56 },
  hihat: { base: [0.68, 0, -0.45] as Vec3, height: 0.93 },
  crash: { base: [0.78, 0, 0.36] as Vec3, height: 1.0 },
  ride: { base: [-1.02, 0, 0.24] as Vec3, height: 0.9 },
  throne: [0, 0, -0.82] as Vec3,
  pedal: [0, 0, -0.38] as Vec3,
};
