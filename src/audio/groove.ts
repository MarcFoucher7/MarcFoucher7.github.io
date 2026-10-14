import { gsap } from 'gsap';
import type { HitVariant, PieceId } from '../kit/ids';
import { audio, currentAudio } from './engine';
import { emitHit } from './hits';
import { playPiece } from './voices';

/** Tempo du groove (noires par minute). */
export const BPM = 96;
const STEP = 60 / BPM / 4; // durée d'une double-croche
const LOOKAHEAD = 0.12;

type Lane = [PieceId, number[], HitVariant?];

/** Mesure de base : rock binaire, charleston en croches, ghost notes sur la caisse claire. */
const BAR: Lane[] = [
  ['hihat', [1, 0, 0.55, 0, 0.9, 0, 0.55, 0, 1, 0, 0.55, 0, 0.9, 0, 0.55, 0]],
  ['kick', [1, 0, 0, 0, 0, 0, 0, 0, 0.95, 0, 0.8, 0, 0, 0, 0, 0]],
  ['snare', [0, 0, 0, 0, 1, 0, 0, 0.22, 0, 0, 0, 0, 1, 0, 0, 0.25]],
];

/** Quatrième mesure : break aux toms sur le dernier temps. */
const FILL: Lane[] = [
  ['hihat', [1, 0, 0.55, 0, 0.9, 0, 0.55, 0, 1, 0, 0.55, 0, 0, 0, 0, 0]],
  ['kick', [1, 0, 0, 0, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 0, 0, 0]],
  ['snare', [0, 0, 0, 0, 1, 0, 0, 0.22, 0, 0, 0, 0, 0.9, 0.7, 0, 0]],
  ['tom1', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.9, 0]],
  ['tom2', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.85]],
  ['floor', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.9]],
  ['hihat', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.7, 0, 0, 0, 0], 'open'],
];

interface Scheduled {
  time: number;
  piece: PieceId;
  velocity: number;
  variant: HitVariant;
}

let timer = 0;
let nextTime = 0;
let step = 0;
const queue: Scheduled[] = [];
const beatListeners = new Set<(beat: number) => void>();
const beatQueue: { time: number; beat: number }[] = [];

/** Abonnement au temps fort du métronome (0 à 3 dans la mesure). */
export function onBeat(listener: (beat: number) => void): () => void {
  beatListeners.add(listener);
  return () => beatListeners.delete(listener);
}

function schedule(): void {
  const e = currentAudio();
  if (!e) return;
  while (nextTime < e.ctx.currentTime + LOOKAHEAD) {
    const bar = Math.floor(step / 16) % 4;
    const s = step % 16;
    const lanes = bar === 3 ? FILL : BAR;
    for (const [piece, pattern, variant] of lanes) {
      const v = pattern[s] ?? 0;
      if (v <= 0) continue;
      // Petite humanisation : vélocité et placement légèrement variables.
      const vel = Math.min(1, v * (0.92 + Math.random() * 0.12));
      const t = nextTime + (Math.random() - 0.5) * 0.006;
      const at = playPiece(piece, vel, variant ?? 'closed', Math.max(t, e.ctx.currentTime));
      if (at !== null) queue.push({ time: at, piece, velocity: vel, variant: variant ?? 'closed' });
    }
    if (s === 0 && bar === 0 && step > 0) {
      const at = playPiece('crash', 0.85, 'closed', nextTime);
      if (at !== null) queue.push({ time: at, piece: 'crash', velocity: 0.85, variant: 'closed' });
    }
    if (s % 4 === 0) beatQueue.push({ time: nextTime, beat: s / 4 });
    nextTime += STEP;
    step += 1;
  }
}

/** Déclenche les animations au moment exact où le son est entendu. */
function dispatch(): void {
  const e = currentAudio();
  if (!e) return;
  const now = e.ctx.currentTime;
  while (queue.length && (queue[0] as Scheduled).time <= now) {
    const h = queue.shift() as Scheduled;
    emitHit({ piece: h.piece, velocity: h.velocity, variant: h.variant });
  }
  while (beatQueue.length && (beatQueue[0] as { time: number }).time <= now) {
    const b = beatQueue.shift() as { beat: number };
    beatListeners.forEach((l) => l(b.beat));
  }
}

export function isGrooving(): boolean {
  return timer !== 0;
}

/** Lance le groove (geste utilisateur requis pour l'audio). */
export function startGroove(): boolean {
  const e = audio();
  if (!e || timer) return false;
  step = 0;
  nextTime = e.ctx.currentTime + 0.08;
  queue.length = 0;
  beatQueue.length = 0;
  // Crash d'ouverture sur le premier temps.
  const at = playPiece('crash', 0.9, 'closed', nextTime);
  if (at !== null) queue.push({ time: at, piece: 'crash', velocity: 0.9, variant: 'closed' });
  schedule();
  timer = window.setInterval(schedule, 25);
  gsap.ticker.add(dispatch);
  return true;
}

export function stopGroove(): void {
  if (!timer) return;
  window.clearInterval(timer);
  timer = 0;
  queue.length = 0;
  beatQueue.length = 0;
  gsap.ticker.remove(dispatch);
}
