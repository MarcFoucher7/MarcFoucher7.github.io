import { readStorage, writeStorage } from '../store/storage';

/**
 * État de la « frappe » de cymbale, lu à 60 fps par la scène (pas de React ici).
 * age : secondes depuis la dernière frappe ; amp : force de la frappe.
 */
export const hitState = { age: 99, amp: 0 };

let ctx: AudioContext | null = null;
let soundOn = readStorage('local', 'sound') === 'on';

export function isSoundOn(): boolean {
  return soundOn;
}

export function setSoundOn(on: boolean): void {
  soundOn = on;
  writeStorage('local', 'sound', on ? 'on' : 'off');
  if (on) strike(0.6);
}

/** Cymbale synthétisée (bruit blanc filtré + enveloppe), aucun fichier audio. */
function play(strength: number): void {
  try {
    ctx ??= new AudioContext();
    const now = ctx.currentTime;
    const length = Math.floor(ctx.sampleRate * 2.2);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const high = ctx.createBiquadFilter();
    high.type = 'highpass';
    high.frequency.value = 6500;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 9500;
    band.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22 * strength, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2);
    noise.connect(high).connect(band).connect(gain).connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 2.1);
  } catch {
    /* audio indisponible : on ignore */
  }
}

/** Frappe la cymbale : onde visuelle, et son si l'utilisateur l'a activé. */
export function strike(strength = 1): void {
  hitState.age = 0;
  hitState.amp = Math.min(1, strength);
  if (soundOn) play(strength);
}
