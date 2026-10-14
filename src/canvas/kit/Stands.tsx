import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BoxGeometry, Vector3, type BufferGeometry, type Group } from 'three';
import { kitState } from '../state';
import {
  beaterGeometry,
  boomGeometry,
  merge,
  pedalGeometry,
  rod,
  throneGeometry,
  tripodGeometry,
} from './geometry';
import { PIECES, STANDS, type Vec3 } from './layout';
import type { KitMaterials } from './materials';

const v = (p: Vec3, dx = 0, dy = 0, dz = 0): Vector3 =>
  new Vector3(p[0] + dx, p[1] + dy, p[2] + dz);

function at(g: BufferGeometry, p: Vec3): BufferGeometry {
  return g.translate(p[0], p[1], p[2]);
}

/**
 * Tous les pieds, perches, pieds de tom basse, éperons et support de toms,
 * fusionnés en une seule géométrie chromée (un seul draw call).
 * Ils restent au sol pendant la vue éclatée : seuls les fûts et cymbales s'envolent.
 */
function buildChrome(): BufferGeometry {
  const parts: BufferGeometry[] = [];

  // Caisse claire : trépied + panier à trois bras.
  const sn = STANDS.snare;
  parts.push(at(tripodGeometry(sn.height, 0.26), sn.base));
  const snTop = v(sn.base, 0, sn.height, 0);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 2;
    const tip = v(sn.base, Math.cos(a) * 0.17, sn.height + 0.05, Math.sin(a) * 0.17);
    parts.push(rod(snTop, tip, 0.006));
  }

  // Charleston : trépied, tige de tirage, pédale.
  const hh = STANDS.hihat;
  parts.push(at(tripodGeometry(hh.height, 0.27), hh.base));
  parts.push(rod(v(hh.base, 0, hh.height, 0), v(hh.base, 0, hh.height + 0.14, 0), 0.004));
  parts.push(rod(v(hh.base, 0, 0.05, 0), v(hh.base, 0, 0.06, -0.2), 0.006));

  // Crash et ride : trépieds + perches jusqu'au centre des cymbales.
  for (const key of ['crash', 'ride'] as const) {
    const s = STANDS[key];
    const p = PIECES[key].position;
    parts.push(at(tripodGeometry(s.height, 0.3), s.base));
    parts.push(boomGeometry(v(s.base, 0, s.height, 0), v(p, 0, -0.07, 0)));
  }

  // Tom basse : trois pieds fixés au fût.
  const fl = PIECES.floor.position;
  for (const a of [Math.PI / 2, (7 * Math.PI) / 6, (11 * Math.PI) / 6]) {
    const bracket = v(fl, Math.cos(a) * 0.225, 0.06, Math.sin(a) * 0.225);
    const foot = v(fl, Math.cos(a) * 0.3, -fl[1] + 0.012, Math.sin(a) * 0.3);
    parts.push(rod(bracket, foot, 0.0085));
  }

  // Grosse caisse : éperons avant + support des toms.
  const k = PIECES.kick.position;
  for (const side of [-1, 1]) {
    parts.push(rod(v(k, side * 0.24, -0.08, 0.12), v(k, side * 0.42, -k[1] + 0.012, 0.3), 0.009));
  }
  const post = v(k, 0, 0.28, 0.02);
  const head = v(k, 0, 0.4, 0.02);
  parts.push(rod(post, head, 0.012));
  parts.push(rod(head, v(PIECES.tom1.position, -0.06, -0.09, -0.02), 0.009));
  parts.push(rod(head, v(PIECES.tom2.position, 0.06, -0.09, -0.02), 0.009));

  // Siège.
  const throne = throneGeometry();
  parts.push(at(throne.frame, STANDS.throne));
  throne.seat.dispose();

  // Pédale de grosse caisse (cadre).
  const pedal = pedalGeometry();
  parts.push(at(pedal.frame, STANDS.pedal));
  pedal.plate.dispose();

  return merge(parts);
}

/** Pièces noires fixes : assise du siège, repose-pieds des pédales. */
function buildBlack(): BufferGeometry {
  const throne = throneGeometry();
  throne.frame.dispose();
  const pedal = pedalGeometry();
  pedal.frame.dispose();
  const hhPlate = new BoxGeometry(0.085, 0.01, 0.26);
  hhPlate.rotateX(-0.2);
  return merge([
    at(throne.seat, STANDS.throne),
    at(pedal.plate, STANDS.pedal),
    at(hhPlate, [STANDS.hihat.base[0], 0.06, STANDS.hihat.base[2] - 0.32]),
  ]);
}

/** Pieds, siège et pédale ; la batte de la pédale frappe la grosse caisse. */
export function Stands({ mats }: { mats: KitMaterials }) {
  const geo = useMemo(
    () => ({ chrome: buildChrome(), black: buildBlack(), beater: beaterGeometry() }),
    [],
  );
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);
  const beater = useRef<Group>(null);

  useFrame(() => {
    const b = beater.current;
    if (!b) return;
    const energy = kitState.energy.kick;
    // Repos incliné vers le batteur ; aller très rapide vers la peau, retour amorti.
    const t = energy.age;
    const swing = t < 0.035 ? t / 0.035 : Math.exp(-(t - 0.035) * 11);
    b.rotation.x = -0.55 + 0.95 * swing * Math.min(1, energy.value * 1.4 + 0.2) * (t < 2 ? 1 : 0);
  });

  return (
    <group>
      <mesh geometry={geo.chrome} material={mats.chrome} castShadow receiveShadow />
      <mesh geometry={geo.black} material={mats.leather} castShadow receiveShadow />
      <group
        ref={beater}
        position={[STANDS.pedal[0], 0.2, STANDS.pedal[2] + 0.12]}
        rotation-x={-0.55}
      >
        <mesh geometry={geo.beater} material={mats.felt} castShadow />
      </group>
    </group>
  );
}
