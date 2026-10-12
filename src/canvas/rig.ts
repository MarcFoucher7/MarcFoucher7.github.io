import { Vector3 } from 'three';

/**
 * Points d'ancrage du flux, mis à jour par <Rig> à chaque frame
 * et lus par les paquets (une frame de décalage au pire, invisible).
 */
export const rigState = {
  start: new Vector3(),
  end: new Vector3(),
  control: new Vector3(),
  /** 0 → 1 : le flux démarre après la « connexion ». */
  flow: 0,
};

const tmpA = new Vector3();
const tmpB = new Vector3();

/** Point sur la courbe de Bézier quadratique start → control → end. */
export function pointOnStream(t: number, out: Vector3): Vector3 {
  const u = 1 - t;
  tmpA.copy(rigState.start).multiplyScalar(u * u);
  tmpB.copy(rigState.control).multiplyScalar(2 * u * t);
  return out
    .copy(rigState.end)
    .multiplyScalar(t * t)
    .add(tmpA)
    .add(tmpB);
}
