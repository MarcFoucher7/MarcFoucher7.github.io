import type { HitVariant, PieceId } from '../kit/ids';
import { playPiece } from './voices';

export interface HitEvent {
  piece: PieceId;
  velocity: number;
  variant: HitVariant;
}

type Listener = (hit: HitEvent) => void;
const listeners = new Set<Listener>();

/** S'abonne aux frappes (animation 3D, lumières, interface). */
export function onHit(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Diffuse une frappe visuelle sans jouer de son (le son est déjà programmé). */
export function emitHit(hit: HitEvent): void {
  listeners.forEach((l) => l(hit));
}

/** Frappe immédiate déclenchée par l'utilisateur : son + animation. */
export function hit(piece: PieceId, velocity = 1, variant: HitVariant = 'closed'): void {
  playPiece(piece, velocity, variant);
  emitHit({ piece, velocity, variant });
}
