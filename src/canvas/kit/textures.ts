import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from 'three';

/** Générateur pseudo-aléatoire déterministe : mêmes textures à chaque visite. */
export function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D indisponible');
  return [c, ctx];
}

function toTexture(c: HTMLCanvasElement, color = true, repeat = false): CanvasTexture {
  const t = new CanvasTexture(c);
  if (color) t.colorSpace = SRGBColorSpace;
  if (repeat) {
    t.wrapS = RepeatWrapping;
    t.wrapT = RepeatWrapping;
  }
  t.anisotropy = 4;
  return t;
}

/** Laque pailletée (« sparkle ») des fûts : fond profond + paillettes claires. */
export function sparkleTexture(base: string): Texture {
  const [c, ctx] = canvas(256, 256);
  const r = rng(11);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) {
    const v = r();
    ctx.fillStyle =
      v > 0.82 ? 'rgba(210,255,240,0.55)' : v > 0.5 ? 'rgba(0,0,0,0.25)' : 'rgba(120,230,200,0.18)';
    ctx.fillRect(r() * 256, r() * 256, 1 + r() * 1.4, 1 + r() * 1.4);
  }
  return toTexture(c, true, true);
}

/** Peau de frappe sablée : blanc cassé marbré, cercle central plus sombre en option. */
export function headTexture(dot: boolean): Texture {
  const [c, ctx] = canvas(512, 512);
  const r = rng(dot ? 21 : 22);
  ctx.fillStyle = '#ece3d2';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = `rgba(${r() > 0.5 ? '255,255,255' : '120,100,80'},${0.05 + r() * 0.06})`;
    ctx.fillRect(r() * 512, r() * 512, 2, 2);
  }
  // Zone de frappe usée au centre.
  const g = ctx.createRadialGradient(256, 256, 10, 256, 256, 200);
  g.addColorStop(0, 'rgba(110,90,70,0.16)');
  g.addColorStop(1, 'rgba(110,90,70,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  if (dot) {
    ctx.fillStyle = 'rgba(40,30,25,0.55)';
    ctx.beginPath();
    ctx.arc(256, 256, 62, 0, Math.PI * 2);
    ctx.fill();
  }
  return toTexture(c);
}

/** Sillons de tournage des cymbales, le long du profil (axe V de la LatheGeometry). */
export function cymbalTexture(): Texture {
  const [c, ctx] = canvas(32, 1024);
  const r = rng(31);
  for (let y = 0; y < 1024; y++) {
    const l = 0.78 + Math.sin(y * 0.9) * 0.08 + (r() - 0.5) * 0.18;
    const v = Math.round(255 * Math.min(1, Math.max(0.45, l)));
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(0, y, 32, 1);
  }
  const t = toTexture(c, true, true);
  t.repeat.set(24, 1);
  return t;
}

/** Parquet sombre : lames de longueur variable, veinage, joints. */
export function floorTexture(): Texture {
  const [c, ctx] = canvas(1024, 1024);
  const r = rng(41);
  const rows = 8;
  const h = 1024 / rows;
  for (let row = 0; row < rows; row++) {
    let x = -r() * 300;
    while (x < 1024) {
      const w = 260 + r() * 340;
      const tone = 34 + r() * 22;
      ctx.fillStyle = `rgb(${tone + 22},${tone + 8},${tone - 6})`;
      ctx.fillRect(x, row * h, w, h);
      for (let k = 0; k < 14; k++) {
        ctx.strokeStyle = `rgba(0,0,0,${0.08 + r() * 0.1})`;
        ctx.lineWidth = 1 + r() * 1.5;
        ctx.beginPath();
        const y0 = row * h + r() * h;
        ctx.moveTo(x, y0);
        for (let s = 0; s <= w; s += 40) ctx.lineTo(x + s, y0 + Math.sin((s + k * 30) * 0.02) * 4);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(x, row * h, 2, h);
      x += w;
    }
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, row * h, 1024, 2);
  }
  const t = toTexture(c, true, true);
  t.repeat.set(3, 3);
  return t;
}

/** Tapis de batterie aux couleurs du studio (bordeaux, ambre, sarcelle). */
export function rugTexture(): Texture {
  const [c, ctx] = canvas(1024, 820);
  const W = 1024;
  const H = 820;
  ctx.fillStyle = '#4a141c';
  ctx.fillRect(0, 0, W, H);
  const band = (inset: number, width: number, color: string): void => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2);
  };
  band(18, 22, '#d98a2b');
  band(52, 30, '#1f6e66');
  band(84, 6, '#d98a2b');
  // Frise de losanges dans la bordure sarcelle.
  ctx.fillStyle = '#e9b765';
  for (let x = 70; x < W - 60; x += 34) {
    ctx.beginPath();
    ctx.moveTo(x, 52);
    ctx.lineTo(x + 9, 43);
    ctx.lineTo(x + 18, 52);
    ctx.lineTo(x + 9, 61);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, H - 52);
    ctx.lineTo(x + 9, H - 61);
    ctx.lineTo(x + 18, H - 52);
    ctx.lineTo(x + 9, H - 43);
    ctx.fill();
  }
  // Médaillon central.
  ctx.save();
  ctx.translate(W / 2, H / 2);
  for (let i = 0; i < 4; i++) {
    const s = 230 - i * 52;
    ctx.fillStyle = ['#7a1f2b', '#d98a2b', '#1f6e66', '#2a0b10'][i] as string;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 1.35, 0);
    ctx.lineTo(0, s);
    ctx.lineTo(-s * 1.35, 0);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  // Usure : poussière claire.
  const r = rng(51);
  for (let i = 0; i < 16000; i++) {
    ctx.fillStyle = `rgba(255,230,200,${r() * 0.05})`;
    ctx.fillRect(r() * W, r() * H, 2, 2);
  }
  return toTexture(c);
}

/** Peau de résonance de la grosse caisse : le « logo du groupe » au nom de Marc. */
export async function kickLogoTexture(display: string, mono: string): Promise<Texture> {
  const [c, ctx] = canvas(1024, 1024);
  try {
    await Promise.all([
      document.fonts.load(`900 300px "${display}"`),
      document.fonts.load(`400 40px "${mono}"`),
    ]);
  } catch {
    /* polices de repli */
  }
  const g = ctx.createRadialGradient(512, 512, 60, 512, 512, 512);
  g.addColorStop(0, '#2a0f14');
  g.addColorStop(1, '#13070a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.strokeStyle = '#ffa53d';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(512, 512, 330, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(512, 512, 300, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffa53d';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 330px "${display}", Impact, sans-serif`;
  ctx.fillText('MF', 512, 500);
  ctx.font = `400 34px "${mono}", monospace`;
  ctx.fillStyle = '#f6ead9';
  ctx.fillText('FULLSTACK  /  LAVAL', 512, 690);
  // Texte en arc au-dessus.
  const text = 'MARC FOUCHER  STUDIO  2026';
  ctx.font = `400 40px "${mono}", monospace`;
  const radius = 375;
  const span = Math.PI * 0.62;
  [...text].forEach((ch, i) => {
    const a = -Math.PI / 2 - span / 2 + (span * i) / (text.length - 1);
    ctx.save();
    ctx.translate(512 + Math.cos(a) * radius, 512 + Math.sin(a) * radius);
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });
  return toTexture(c);
}

/** Boîtier lumineux « REC ». */
export function recTexture(mono: string): Texture {
  const [c, ctx] = canvas(256, 96);
  ctx.fillStyle = '#1a0507';
  ctx.fillRect(0, 0, 256, 96);
  ctx.fillStyle = '#ff3d3d';
  ctx.beginPath();
  ctx.arc(54, 48, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = `700 52px "${mono}", monospace`;
  ctx.textBaseline = 'middle';
  ctx.fillText('REC', 90, 50);
  return toTexture(c);
}
