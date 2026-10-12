import { IcosahedronGeometry, Quaternion, Vector3 } from 'three';

/** Générateur pseudo-aléatoire déterministe (mulberry32) : même nuage à chaque visite. */
function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ParticleData {
  shapes: Float32Array[];
  random: Float32Array;
  accent: Float32Array;
}

/** Sommets et faces du D20 (icosaèdre), partagés avec la rotation par étape. */
const ico = new IcosahedronGeometry(1.9, 0);
const icoPos = ico.getAttribute('position');
const FACES: Vector3[][] = [];
for (let i = 0; i < icoPos.count; i += 3) {
  FACES.push([0, 1, 2].map((k) => new Vector3().fromBufferAttribute(icoPos, i + k)));
}
const EDGES: [Vector3, Vector3][] = [];
const seen = new Set<string>();
const key = (v: Vector3): string => `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
FACES.forEach((face) => {
  for (let k = 0; k < 3; k++) {
    const a = face[k] as Vector3;
    const b = face[(k + 1) % 3] as Vector3;
    const id = [key(a), key(b)].sort().join('|');
    if (!seen.has(id)) {
      seen.add(id);
      EDGES.push([a, b]);
    }
  }
});

/** Arcs de connexion du globe : paires de nœuds aléatoires mais stables. */
const ARCS: [Vector3, Vector3][] = (() => {
  const r = rng(7);
  const node = (): Vector3 => {
    const lat = Math.asin(r() * 2 - 1);
    const lon = r() * Math.PI * 2;
    return new Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon));
  };
  return Array.from({ length: 26 }, () => {
    const a = node();
    let b = node();
    while (a.angleTo(b) > 1.7 || a.angleTo(b) < 0.5) b = node();
    return [a, b] as [Vector3, Vector3];
  });
})();

/** Orientations du D20 : chaque étape amène une face différente vers la caméra. */
export const D20_FACE_ORIENTATIONS: Quaternion[] = [0, 7, 13, 4, 17, 10].map((index) => {
  const face = FACES[index % FACES.length] as Vector3[];
  const normal = new Vector3()
    .add(face[0] as Vector3)
    .add(face[1] as Vector3)
    .add(face[2] as Vector3)
    .normalize();
  return new Quaternion().setFromUnitVectors(normal, new Vector3(0, 0, 1));
});

/** Génère les 5 formes du nuage et les attributs aléatoires par particule. */
export function buildParticles(count: number): ParticleData {
  const r = rng(20262027);
  const shapes = Array.from({ length: 5 }, () => new Float32Array(count * 3));
  const random = new Float32Array(count * 4);
  const accent = new Float32Array(count);
  const tmp = new Vector3();

  const [globe, wave, d20, field, ring] = shapes as [
    Float32Array,
    Float32Array,
    Float32Array,
    Float32Array,
    Float32Array,
  ];
  const cols = Math.round(Math.sqrt(count * 2.4));
  const rows = Math.ceil(count / cols);
  const golden = Math.PI * (3 - Math.sqrt(5));

  // Ordre mélangé : n'importe quel préfixe du tableau couvre toute la forme,
  // ce qui permet de réduire le nombre de particules affichées (drawRange) sans trou.
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [order[i], order[j]] = [order[j] as number, order[i] as number];
  }

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const k = order[i] as number;

    // 0. Globe réseau : parallèles et méridiens en pointillés, arcs de connexion
    //    au-dessus de la surface (les « paquets » entre deux nœuds), un peu de poussière.
    const R0 = 1.9;
    const g = r();
    if (g < 0.42) {
      if (r() < 0.5) {
        const lat = ((Math.floor(r() * 11) + 1) / 12 - 0.5) * Math.PI;
        const lon = r() * Math.PI * 2;
        tmp.set(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon));
      } else {
        const lon = (Math.floor(r() * 12) / 12) * Math.PI * 2;
        const lat = (r() - 0.5) * Math.PI;
        tmp.set(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon));
      }
      tmp.multiplyScalar(R0);
    } else if (g < 0.8) {
      const [a, b] = ARCS[Math.floor(r() * ARCS.length)] as [Vector3, Vector3];
      const u = r();
      tmp
        .copy(a)
        .lerp(b, u)
        .normalize()
        .multiplyScalar(R0 * (1 + 0.22 * Math.sin(Math.PI * u)));
    } else {
      const y = 1 - (k / (count - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const theta = golden * k;
      tmp
        .set(Math.cos(theta) * rad, y, Math.sin(theta) * rad)
        .multiplyScalar(R0 * (0.98 + r() * 0.04));
    }
    globe[i3] = tmp.x;
    globe[i3 + 1] = tmp.y;
    globe[i3 + 2] = tmp.z;

    // 1. Vague : grille large et basse (le relief est animé dans le shader).
    const cx = k % cols;
    const cz = Math.floor(k / cols);
    wave[i3] = (cx / (cols - 1) - 0.5) * 15;
    wave[i3 + 1] = (r() - 0.5) * 0.05;
    wave[i3 + 2] = (cz / Math.max(rows - 1, 1) - 0.5) * 6 - 1;

    // 2. D20 : arêtes denses, sommets marqués, faces clairsemées.
    const pick = r();
    if (pick < 0.78) {
      const [a, b] = EDGES[Math.floor(r() * EDGES.length)] as [Vector3, Vector3];
      tmp.copy(a).lerp(b, r());
      tmp.addScaledVector(tmp.clone().normalize(), (r() - 0.5) * 0.02);
    } else if (pick < 0.86) {
      const face = FACES[Math.floor(r() * FACES.length)] as Vector3[];
      tmp.copy(face[Math.floor(r() * 3)] as Vector3).multiplyScalar(1 + (r() - 0.5) * 0.08);
    } else {
      const face = FACES[Math.floor(r() * FACES.length)] as Vector3[];
      let u = r();
      let v = r();
      if (u + v > 1) {
        u = 1 - u;
        v = 1 - v;
      }
      tmp
        .copy(face[0] as Vector3)
        .multiplyScalar(1 - u - v)
        .addScaledVector(face[1] as Vector3, u)
        .addScaledVector(face[2] as Vector3, v);
    }
    d20[i3] = tmp.x;
    d20[i3 + 1] = tmp.y;
    d20[i3 + 2] = tmp.z;

    // 3. Champ : poussière d'étoiles en profondeur.
    field[i3] = (r() - 0.5) * 20;
    field[i3 + 1] = (r() - 0.5) * 12;
    field[i3 + 2] = -7 + r() * 9;

    // 4. Anneau incliné (tore fin).
    const a = r() * Math.PI * 2;
    const b = r() * Math.PI * 2;
    const tube = 0.38 * Math.sqrt(r());
    const R = 2.2 + tube * Math.cos(b);
    const rx = Math.cos(a) * R;
    const ry = tube * Math.sin(b);
    const rz = Math.sin(a) * R;
    const tilt = 1.15;
    ring[i3] = rx;
    ring[i3 + 1] = ry * Math.cos(tilt) - rz * Math.sin(tilt);
    ring[i3 + 2] = ry * Math.sin(tilt) + rz * Math.cos(tilt);

    random[i * 4] = r() * 2 - 1;
    random[i * 4 + 1] = r() * 2 - 1;
    random[i * 4 + 2] = r() * 2 - 1;
    random[i * 4 + 3] = r();
    accent[i] = r() < 0.07 ? 1 : 0;
  }

  return { shapes, random, accent };
}
