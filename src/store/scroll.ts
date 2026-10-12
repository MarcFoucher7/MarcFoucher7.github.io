/**
 * Valeurs mutables lues dans useFrame (60 fps) : jamais de setState React ici.
 * Écrites par les ScrollTrigger, lues par la scène 3D.
 */
export const scrollState = {
  /** 0 en haut du hero, 1 quand le hero est sorti de l'écran. */
  hero: 0,
  /** Position du pointeur normalisée entre -1 et 1. */
  pointerX: 0,
  pointerY: 0,
};
