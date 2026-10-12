/**
 * Valeurs mutables lues à 60 fps (scène 3D, marquee, curseur) : jamais de setState ici.
 */
export const scrollState = {
  /** Vitesse de scroll Lenis (px par frame, signée). */
  velocity: 0,
  /** Pointeur en pixels écran. */
  x: 0,
  y: 0,
  /** Pointeur normalisé entre -1 et 1 (y vers le haut). */
  nx: 0,
  ny: 0,
  /** Horodatage du dernier mouvement du pointeur (ms). */
  movedAt: 0,
};
