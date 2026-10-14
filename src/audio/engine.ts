/**
 * Moteur audio WebAudio : chaîne maître (compresseur, réverb de pièce, analyseur).
 * Créé paresseusement au premier geste de l'utilisateur (politique d'autoplay).
 */
interface Engine {
  ctx: AudioContext;
  /** Entrée sèche (vers le compresseur). */
  dry: GainNode;
  /** Départ réverb. */
  send: GainNode;
  master: GainNode;
  analyser: AnalyserNode;
  noise: AudioBuffer;
}

let engine: Engine | null = null;
let muted = false;

/** Réponse impulsionnelle synthétique : petite pièce traitée (studio), ~1,6 s. */
function roomImpulse(ctx: AudioContext): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * 1.6);
  const ir = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = ir.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      const t = i / length;
      // Premières réflexions plus denses, puis queue exponentielle.
      const early = i < ctx.sampleRate * 0.03 ? 1.6 : 1;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3.2) * early;
    }
  }
  return ir;
}

function create(): Engine | null {
  try {
    const Ctor = window.AudioContext;
    const ctx = new Ctor({ latencyHint: 'interactive' });
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.ratio.value = 4;
    comp.attack.value = 0.003;
    comp.release.value = 0.22;
    const master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.9;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.6;
    const dry = ctx.createGain();
    const send = ctx.createGain();
    const convolver = ctx.createConvolver();
    convolver.buffer = roomImpulse(ctx);
    const wet = ctx.createGain();
    wet.gain.value = 0.32;
    dry.connect(comp);
    send.connect(convolver).connect(wet).connect(comp);
    comp.connect(master).connect(analyser).connect(ctx.destination);

    const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    return { ctx, dry, send, master, analyser, noise };
  } catch {
    return null;
  }
}

/** Retourne le moteur (le crée et le réveille si besoin). À appeler depuis un geste utilisateur. */
export function audio(): Engine | null {
  engine ??= create();
  if (engine && engine.ctx.state === 'suspended') void engine.ctx.resume();
  return engine;
}

/** Moteur existant, sans le créer (lecture de l'analyseur, horloge). */
export function currentAudio(): Engine | null {
  return engine;
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  if (engine) engine.master.gain.setTargetAtTime(value ? 0 : 0.9, engine.ctx.currentTime, 0.02);
}

/** Niveau RMS de sortie entre 0 et 1 (0 si aucun son n'a encore été joué). */
const levels = new Uint8Array(128);
export function outputLevel(): number {
  if (!engine) return 0;
  engine.analyser.getByteTimeDomainData(levels);
  let sum = 0;
  for (const v of levels) {
    const x = (v - 128) / 128;
    sum += x * x;
  }
  return Math.min(1, Math.sqrt(sum / levels.length) * 3);
}

/** Bandes de fréquences normalisées pour le VU-mètre (n barres). */
const spectrum = new Uint8Array(128);
export function bands(n: number): number[] {
  if (!engine) return Array.from({ length: n }, () => 0);
  engine.analyser.getByteFrequencyData(spectrum);
  const out: number[] = [];
  const size = Math.floor(spectrum.length / n);
  for (let b = 0; b < n; b++) {
    let s = 0;
    for (let i = b * size; i < (b + 1) * size; i++) s += spectrum[i] ?? 0;
    out.push(s / size / 255);
  }
  return out;
}
