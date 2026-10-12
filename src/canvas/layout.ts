import { MathUtils } from 'three';

export interface RigLayout {
  /** Centre du couple de clients. */
  x: number;
  y: number;
  scale: number;
  /** Décalage de A par rapport au centre (B est symétrique). */
  ax: number;
  ay: number;
  /** Rotation Y de A et de B. */
  aRotY: number;
  bRotY: number;
  /** 0 = disposition horizontale (hero), 1 = verticale (contenu). */
  stack: number;
}

const ease = (t: number): number => t * t * (3 - 2 * t);

/**
 * Calcule la disposition des deux clients selon la taille du viewport (unités monde à z = 0)
 * et la progression du scroll dans le hero.
 */
export function computeLayout(width: number, height: number, heroProgress: number): RigLayout {
  const aspect = width / height;
  const p = ease(MathUtils.clamp(heroProgress * 1.15, 0, 1));

  if (aspect < 1) {
    // Mobile / tablette portrait : les clients restent côte à côte en haut de l'écran.
    const scale = MathUtils.clamp(width / 6.2, 0.38, 0.62);
    return {
      x: 0,
      y: height * 0.315 + p * height * 0.06,
      scale,
      ax: -1.62 * scale - 0.02,
      ay: 0.08,
      aRotY: 0.42,
      bRotY: -0.42,
      stack: 0,
    };
  }

  const scale = MathUtils.clamp(width / 13, 0.62, 1);
  const hero = {
    x: width * 0.25,
    y: height * 0.1,
    ax: -1.55 * scale,
    ay: 0.12,
    aRotY: 0.3,
    bRotY: -0.3,
  };
  const content = { x: width * 0.3, y: -0.05, ax: 0, ay: 1.18 * scale, aRotY: -0.36, bRotY: -0.36 };

  return {
    x: MathUtils.lerp(hero.x, content.x, p),
    y: MathUtils.lerp(hero.y, content.y, p),
    scale: MathUtils.lerp(scale * 0.95, scale * 0.8, p),
    ax: MathUtils.lerp(hero.ax, content.ax, p),
    ay: MathUtils.lerp(hero.ay, content.ay, p),
    aRotY: MathUtils.lerp(hero.aRotY, content.aRotY, p),
    bRotY: MathUtils.lerp(hero.bRotY, content.bRotY, p),
    stack: p,
  };
}
