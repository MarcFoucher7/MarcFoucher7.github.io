import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MathUtils, type Group, type MeshStandardMaterial } from 'three';
import { PIECE_IDS, type PieceId } from '../../kit/ids';
import { kitState } from '../state';
import { cymbalGeometry, feltGeometry } from './geometry';
import type { KitMaterials } from './materials';

interface CymbalProps {
  id: PieceId;
  radius: number;
  bell: number;
  bow: number;
  mats: KitMaterials;
}

const GLOW = new Color('#ffb35c');
const HIGHLIGHT = new Color('#3fd9c6');

function useCymbalMaterial(mats: KitMaterials): MeshStandardMaterial {
  const m = useMemo(() => mats.brass.clone() as MeshStandardMaterial, [mats]);
  useEffect(() => () => m.dispose(), [m]);
  return m;
}

/** Brille au survol, s'illumine brièvement à la frappe. */
function animateGlow(m: MeshStandardMaterial, id: PieceId, delta: number): void {
  const energy = kitState.energy[id];
  const lit = kitState.hovered === id || PIECE_IDS[kitState.focus] === id;
  if (energy.value > 0.05) {
    m.emissive.copy(GLOW);
    m.emissiveIntensity = energy.value * 0.35;
  } else {
    m.emissive.copy(HIGHLIGHT);
    m.emissiveIntensity = MathUtils.damp(m.emissiveIntensity, lit ? 0.12 : 0, 8, delta);
  }
}

/** Cymbale (crash, ride) : la pièce entière oscille via le wrapper <Piece>. */
export function Cymbal({ id, radius, bell, bow, mats }: CymbalProps) {
  const geo = useMemo(() => cymbalGeometry(radius, bell, bow), [radius, bell, bow]);
  const felt = useMemo(() => feltGeometry(), []);
  const m = useCymbalMaterial(mats);
  useEffect(
    () => () => {
      geo.dispose();
      felt.dispose();
    },
    [geo, felt],
  );
  useFrame((_, delta) => animateGlow(m, id, delta));
  return (
    <group>
      <mesh geometry={geo} material={m} castShadow receiveShadow />
      <mesh geometry={felt} material={mats.felt} />
    </group>
  );
}

/**
 * Charleston : deux cymbales face à face. Ouvert, la cymbale du haut se soulève ;
 * dans la vue éclatée, les deux s'écartent.
 */
export function HiHat({ id, radius, mats }: { id: PieceId; radius: number; mats: KitMaterials }) {
  const geo = useMemo(() => cymbalGeometry(radius, 0.05, 0.016), [radius]);
  const felt = useMemo(() => feltGeometry(), []);
  const m = useCymbalMaterial(mats);
  const top = useRef<Group>(null);
  const bottom = useRef<Group>(null);
  useEffect(
    () => () => {
      geo.dispose();
      felt.dispose();
    },
    [geo, felt],
  );
  useFrame((_, delta) => {
    animateGlow(m, id, delta);
    const e = kitState.explode;
    const energy = kitState.energy[id];
    // Ouvert : la cymbale du haut reste levée le temps de la résonance.
    const open = energy.open ? 0.028 * Math.exp(-energy.age * 2.5) : 0;
    // Fermé : petit choc vers le bas.
    const chick = energy.open ? 0 : -0.004 * energy.value * Math.exp(-energy.age * 20);
    if (top.current) top.current.position.y = 0.012 + open + chick + e * 0.26;
    if (bottom.current) bottom.current.position.y = -0.006 - e * 0.08;
  });
  return (
    <group>
      <group ref={top}>
        <mesh geometry={geo} material={m} castShadow />
        <mesh geometry={felt} material={mats.felt} />
      </group>
      <group ref={bottom} rotation-x={Math.PI}>
        <mesh geometry={geo} material={m} castShadow />
      </group>
    </group>
  );
}
