import type { HitVariant, PieceId } from '../kit/ids';
import { audio } from './engine';

type Engine = NonNullable<ReturnType<typeof audio>>;

/** Enveloppe percussive : montée très courte puis décroissance exponentielle. */
function envelope(e: Engine, peak: number, t: number, decay: number, attack = 0.002): GainNode {
  const g = e.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  return g;
}

function noiseSource(e: Engine, t: number, duration: number): AudioBufferSourceNode {
  const src = e.ctx.createBufferSource();
  src.buffer = e.noise;
  src.start(t, Math.random() * 1.2);
  src.stop(t + duration);
  return src;
}

function filter(e: Engine, type: BiquadFilterType, frequency: number, q = 0.7): BiquadFilterNode {
  const f = e.ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = frequency;
  f.Q.value = q;
  return f;
}

/** Sortie d'une voix : sec + départ réverb dosé. */
function out(e: Engine, node: AudioNode, reverb: number): void {
  node.connect(e.dry);
  if (reverb > 0) {
    const s = e.ctx.createGain();
    s.gain.value = reverb;
    node.connect(s).connect(e.send);
  }
}

function kick(e: Engine, t: number, v: number): void {
  const osc = e.ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(165, t);
  osc.frequency.exponentialRampToValueAtTime(46, t + 0.12);
  const g = envelope(e, 1.1 * v, t, 0.6, 0.003);
  osc.connect(g);
  out(e, g, 0.06);
  osc.start(t);
  osc.stop(t + 0.65);
  // Attaque de la batte (clic aigu très bref).
  const click = noiseSource(e, t, 0.02);
  const cg = envelope(e, 0.28 * v, t, 0.012, 0.0005);
  click.connect(filter(e, 'highpass', 2800)).connect(cg);
  out(e, cg, 0);
}

function snare(e: Engine, t: number, v: number): void {
  const tone = e.ctx.createOscillator();
  tone.type = 'triangle';
  tone.frequency.setValueAtTime(205, t);
  tone.frequency.exponentialRampToValueAtTime(168, t + 0.08);
  const tg = envelope(e, 0.5 * v, t, 0.16);
  tone.connect(tg);
  out(e, tg, 0.2);
  tone.start(t);
  tone.stop(t + 0.2);
  // Timbre : bruit filtré, c'est lui qui « claque ».
  const n = noiseSource(e, t, 0.32);
  const ng = envelope(e, 0.85 * v, t, 0.24, 0.001);
  n.connect(filter(e, 'highpass', 1100))
    .connect(filter(e, 'peaking', 3800, 1))
    .connect(ng);
  out(e, ng, 0.28);
}

function tom(e: Engine, t: number, v: number, f: number, decay: number): void {
  const osc = e.ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(f * 1.55, t);
  osc.frequency.exponentialRampToValueAtTime(f, t + 0.16);
  const g = envelope(e, 0.95 * v, t, decay, 0.003);
  osc.connect(g);
  out(e, g, 0.22);
  osc.start(t);
  osc.stop(t + decay + 0.05);
  const n = noiseSource(e, t, 0.05);
  const ng = envelope(e, 0.18 * v, t, 0.04, 0.001);
  n.connect(filter(e, 'lowpass', 3200)).connect(ng);
  out(e, ng, 0.1);
}

/** Banc d'oscillateurs carrés désaccordés : le grain métallique des cymbales (type 808). */
function metal(e: Engine, t: number, duration: number, base: number): GainNode {
  const sum = e.ctx.createGain();
  sum.gain.value = 0.18;
  for (const ratio of [2, 3, 4.16, 5.43, 6.79, 8.21]) {
    const o = e.ctx.createOscillator();
    o.type = 'square';
    o.frequency.value = base * ratio;
    o.connect(sum);
    o.start(t);
    o.stop(t + duration);
  }
  return sum;
}

function hihat(e: Engine, t: number, v: number, open: boolean): void {
  const decay = open ? 0.55 : 0.06;
  const m = metal(e, t, decay + 0.05, 40);
  const g = envelope(e, 0.42 * v, t, decay, 0.001);
  m.connect(filter(e, 'bandpass', 10000, 0.8))
    .connect(filter(e, 'highpass', 7000))
    .connect(g);
  out(e, g, open ? 0.2 : 0.08);
  const n = noiseSource(e, t, decay + 0.05);
  const ng = envelope(e, 0.16 * v, t, decay * 0.8, 0.001);
  n.connect(filter(e, 'highpass', 8000)).connect(ng);
  out(e, ng, 0.1);
}

function crash(e: Engine, t: number, v: number): void {
  const m = metal(e, t, 2.6, 46);
  const g = envelope(e, 0.34 * v, t, 2.4, 0.002);
  m.connect(filter(e, 'highpass', 4800)).connect(g);
  out(e, g, 0.35);
  const n = noiseSource(e, t, 2.6);
  const ng = envelope(e, 0.36 * v, t, 2.2, 0.001);
  const lp = filter(e, 'lowpass', 14000);
  lp.frequency.setValueAtTime(14000, t);
  lp.frequency.exponentialRampToValueAtTime(6000, t + 2);
  n.connect(filter(e, 'highpass', 3500))
    .connect(lp)
    .connect(ng);
  out(e, ng, 0.35);
}

function ride(e: Engine, t: number, v: number): void {
  const m = metal(e, t, 1.6, 52);
  const g = envelope(e, 0.24 * v, t, 1.4, 0.001);
  m.connect(filter(e, 'bandpass', 8200, 0.9)).connect(g);
  out(e, g, 0.3);
  // La « cloche » du ride : deux partiels purs.
  for (const [f, a] of [
    [2350, 0.09],
    [3510, 0.05],
  ] as const) {
    const o = e.ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const og = envelope(e, a * v, t, 0.6, 0.001);
    o.connect(og);
    out(e, og, 0.25);
    o.start(t);
    o.stop(t + 0.65);
  }
}

/**
 * Joue une pièce à l'instant audio `when` (par défaut : maintenant).
 * Retourne l'instant effectif, ou null si l'audio est indisponible.
 */
export function playPiece(
  piece: PieceId,
  velocity = 1,
  variant: HitVariant = 'closed',
  when?: number,
): number | null {
  const e = audio();
  if (!e) return null;
  const t = when ?? e.ctx.currentTime + 0.005;
  const v = Math.max(0.05, Math.min(1, velocity));
  switch (piece) {
    case 'kick':
      kick(e, t, v);
      break;
    case 'snare':
      snare(e, t, v);
      break;
    case 'tom1':
      tom(e, t, v, 196, 0.55);
      break;
    case 'tom2':
      tom(e, t, v, 152, 0.65);
      break;
    case 'floor':
      tom(e, t, v, 98, 0.9);
      break;
    case 'hihat':
      hihat(e, t, v, variant === 'open');
      break;
    case 'crash':
      crash(e, t, v);
      break;
    case 'ride':
      ride(e, t, v);
      break;
  }
  return t;
}
