import {
  BoxGeometry,
  BufferGeometry,
  CapsuleGeometry,
  CylinderGeometry,
  LatheGeometry,
  Matrix4,
  Quaternion,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const UP = new Vector3(0, 1, 0);

/** Cylindre orienté entre deux points (tube de pied, tirant, jambe). */
export function rod(a: Vector3, b: Vector3, radius: number, segments = 10): BufferGeometry {
  const dir = new Vector3().subVectors(b, a);
  const length = dir.length();
  const g = new CylinderGeometry(radius, radius, length, segments, 1, false);
  const q = new Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
  const m = new Matrix4().compose(
    new Vector3().addVectors(a, b).multiplyScalar(0.5),
    q,
    new Vector3(1, 1, 1),
  );
  g.applyMatrix4(m);
  return g;
}

/** Fusionne en une seule géométrie (un seul draw call), en ne gardant que position/normal/uv. */
export function merge(parts: BufferGeometry[]): BufferGeometry {
  const clean = parts.map((p) => {
    const g = p.index ? p.toNonIndexed() : p;
    for (const name of Object.keys(g.attributes)) {
      if (!['position', 'normal', 'uv'].includes(name)) g.deleteAttribute(name);
    }
    return g;
  });
  const merged = mergeGeometries(clean, false);
  if (!merged) throw new Error('Fusion de géométries impossible');
  return merged;
}

/** Cercle de fût métallique (triple flange simplifié) ou en bois. */
export function hoopGeometry(radius: number, wood: boolean): BufferGeometry {
  if (wood) {
    const band = new CylinderGeometry(radius + 0.012, radius + 0.012, 0.045, 72, 1, true);
    const lip = new TorusGeometry(radius + 0.006, 0.008, 8, 72);
    lip.rotateX(Math.PI / 2);
    lip.translate(0, 0.022, 0);
    return merge([band, lip]);
  }
  const torus = new TorusGeometry(radius + 0.004, 0.0065, 10, 80);
  torus.rotateX(Math.PI / 2);
  torus.translate(0, 0.008, 0);
  const flange = new CylinderGeometry(radius + 0.009, radius + 0.009, 0.02, 80, 1, true);
  return merge([torus, flange]);
}

/** Coquille de cymbale : profil cloche + bombé + bord, tourné autour de Y. */
export function cymbalGeometry(radius: number, bell: number, bow: number): LatheGeometry {
  const pts: Vector2[] = [];
  const steps = 26;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = t * radius;
    let y: number;
    if (r < bell) {
      // Cloche : dôme arrondi.
      const k = r / bell;
      y = bow + bell * 0.42 * Math.sqrt(Math.max(0, 1 - k * k * k));
    } else {
      // Bombé : décroissance douce vers le bord.
      const k = (r - bell) / (radius - bell);
      y = bow * (1 - Math.pow(k, 0.8));
    }
    pts.push(new Vector2(Math.max(r, 0.0005), y));
  }
  return new LatheGeometry(pts, 96);
}

/** Pied trépied chromé : trois jambes, tube central, colliers. */
export function tripodGeometry(height: number, spread: number, collar = 0.32): BufferGeometry {
  const parts: BufferGeometry[] = [];
  const hub = new Vector3(0, collar, 0);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
    const foot = new Vector3(Math.cos(a) * spread, 0.012, Math.sin(a) * spread);
    parts.push(rod(hub, foot, 0.009));
    // Entretoise.
    parts.push(
      rod(
        new Vector3(0, collar * 0.45, 0),
        foot
          .clone()
          .multiplyScalar(0.55)
          .setY(collar * 0.12),
        0.005,
      ),
    );
    const tip = new SphereGeometry(0.014, 8, 6);
    tip.translate(foot.x, 0.012, foot.z);
    parts.push(tip);
  }
  parts.push(rod(new Vector3(0, 0.05, 0), new Vector3(0, height, 0), 0.011));
  const c1 = new CylinderGeometry(0.018, 0.018, 0.035, 14);
  c1.translate(0, collar, 0);
  parts.push(c1);
  const c2 = new CylinderGeometry(0.016, 0.016, 0.03, 14);
  c2.translate(0, height * 0.62, 0);
  parts.push(c2);
  return merge(parts);
}

/** Perche de cymbale (bras incliné) au sommet d'un pied, terminée par le tilter. */
export function boomGeometry(from: Vector3, to: Vector3): BufferGeometry {
  const parts = [rod(from, to, 0.008)];
  const joint = new SphereGeometry(0.02, 12, 10);
  joint.translate(from.x, from.y, from.z);
  parts.push(joint);
  const tilter = new CylinderGeometry(0.012, 0.012, 0.05, 12);
  tilter.translate(to.x, to.y + 0.02, to.z);
  parts.push(tilter);
  return merge(parts);
}

/** Feutres + écrou papillon d'une cymbale (au centre, au-dessus et au-dessous). */
export function feltGeometry(): BufferGeometry {
  const a = new CylinderGeometry(0.02, 0.02, 0.012, 16);
  a.translate(0, 0.03, 0);
  const b = new CylinderGeometry(0.02, 0.02, 0.012, 16);
  b.translate(0, -0.006, 0);
  const wing = new BoxGeometry(0.045, 0.012, 0.008);
  wing.translate(0, 0.045, 0);
  return merge([a, b, wing]);
}

/** Siège du batteur. */
export function throneGeometry(): { seat: BufferGeometry; frame: BufferGeometry } {
  const seat = new CylinderGeometry(0.19, 0.17, 0.09, 40);
  seat.translate(0, 0.52, 0);
  const edge = new TorusGeometry(0.18, 0.025, 10, 40);
  edge.rotateX(Math.PI / 2);
  edge.translate(0, 0.545, 0);
  return { seat: merge([seat, edge]), frame: tripodGeometry(0.47, 0.3, 0.2) };
}

/** Pédale de grosse caisse : plaque, cadre, axe et batte (la batte est séparée pour l'animer). */
export function pedalGeometry(): { frame: BufferGeometry; plate: BufferGeometry } {
  const base = new BoxGeometry(0.1, 0.012, 0.32);
  base.translate(0, 0.006, -0.02);
  const p1 = rod(new Vector3(-0.05, 0.01, 0.12), new Vector3(-0.05, 0.2, 0.12), 0.008);
  const p2 = rod(new Vector3(0.05, 0.01, 0.12), new Vector3(0.05, 0.2, 0.12), 0.008);
  const axle = rod(new Vector3(-0.06, 0.2, 0.12), new Vector3(0.06, 0.2, 0.12), 0.006);
  const plate = new BoxGeometry(0.085, 0.01, 0.24);
  plate.rotateX(-0.22);
  plate.translate(0, 0.06, -0.05);
  return { frame: merge([base, p1, p2, axle]), plate };
}

/** Batte de pédale (pivot à l'origine). */
export function beaterGeometry(): BufferGeometry {
  const shaft = rod(new Vector3(0, 0, 0), new Vector3(0, 0.2, 0), 0.004);
  const head = new SphereGeometry(0.026, 14, 10);
  head.scale(1, 1.1, 0.8);
  head.translate(0, 0.21, 0);
  return merge([shaft, head]);
}

/** Boîtier de tirant (capsule verticale) et tige de tension. */
export function lugGeometry(length: number): BufferGeometry {
  return new CapsuleGeometry(0.0065, length * 0.8, 4, 10);
}

export function tensionRodGeometry(length: number): BufferGeometry {
  return new CylinderGeometry(0.0028, 0.0028, length, 6);
}
