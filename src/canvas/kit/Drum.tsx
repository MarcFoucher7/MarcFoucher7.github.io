import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  CircleGeometry,
  Color,
  CylinderGeometry,
  MathUtils,
  Matrix4,
  MeshBasicMaterial,
  Quaternion,
  RingGeometry,
  Vector3,
  type InstancedMesh,
  type Material,
  type Mesh,
  type MeshPhysicalMaterial,
  type MeshStandardMaterial,
} from 'three';
import { PIECE_IDS, type PieceId } from '../../kit/ids';
import { kitState } from '../state';
import { hoopGeometry, lugGeometry, tensionRodGeometry } from './geometry';
import type { DrumShape } from './layout';
import type { KitMaterials } from './materials';

interface DrumProps {
  id: PieceId;
  shape: DrumShape;
  mats: KitMaterials;
  /** Peau du dessus personnalisée (logo de la grosse caisse). */
  topHead?: Material;
}

const HIGHLIGHT = new Color('#3fd9c6');
const IDENTITY = new Quaternion();
const ONE = new Vector3(1, 1, 1);

/**
 * Un fût complet, axe local Y : coque laquée, intérieur bois, peaux, cercles, tirants.
 * Chaque composant s'écarte le long de l'axe dans la vue éclatée ; la peau s'illumine
 * et une onde la parcourt à chaque frappe.
 */
export function Drum({ id, shape, mats, topHead }: DrumProps) {
  const { radius: r, depth: d, lugs, woodHoop = false, dot = false } = shape;
  const doubleLugs = d > 0.3;
  const lugCount = doubleLugs ? lugs * 2 : lugs;

  const geo = useMemo(() => {
    const head = new CircleGeometry(r * 0.985, 80);
    return {
      shell: new CylinderGeometry(r, r, d, 80, 1, true),
      inner: new CylinderGeometry(r - 0.004, r - 0.004, d * 0.98, 80, 1, true),
      top: head.clone().rotateX(-Math.PI / 2),
      bottom: head.clone().rotateX(Math.PI / 2),
      hoop: hoopGeometry(r, woodHoop),
      lug: lugGeometry(Math.min(d * (doubleLugs ? 0.16 : 0.38), 0.07)),
      rod: tensionRodGeometry(Math.max(0.03, d * 0.2)),
      ring: new RingGeometry(0.9, 1, 64).rotateX(-Math.PI / 2),
    };
  }, [r, d, woodHoop, doubleLugs]);

  const mat = useMemo(
    () => ({
      shell: mats.lacquer.clone() as MeshPhysicalMaterial,
      head: (dot ? mats.headDot : mats.head).clone() as MeshStandardMaterial,
      ring: new MeshBasicMaterial({
        color: '#ffb35c',
        transparent: true,
        opacity: 0,
        depthWrite: false,
        toneMapped: false,
        blending: AdditiveBlending,
      }),
    }),
    [mats, dot],
  );

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      Object.values(mat).forEach((m) => m.dispose());
    },
    [geo, mat],
  );

  const topHoop = useRef<Mesh>(null);
  const bottomHoop = useRef<Mesh>(null);
  const topHeadRef = useRef<Mesh>(null);
  const bottomHeadRef = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);
  const lugMesh = useRef<InstancedMesh>(null);
  const rodMesh = useRef<InstancedMesh>(null);
  const last = useRef(-1);

  const tmp = useMemo(() => ({ m: new Matrix4(), p: new Vector3() }), []);

  /** Place tirants et tiges en fonction de l'éclatement (seulement quand il change). */
  const layoutLugs = (e: number): void => {
    const lm = lugMesh.current;
    const rm = rodMesh.current;
    if (!lm || !rm) return;
    const radial = r + 0.012 + e * 0.07;
    const hoopShift = e * (0.22 + d * 0.45);
    const rodLen = Math.max(0.03, d * 0.2);
    for (let i = 0; i < lugs; i++) {
      const a = (i / lugs) * Math.PI * 2 + Math.PI / lugs;
      const x = Math.cos(a) * radial;
      const z = Math.sin(a) * radial;
      if (doubleLugs) {
        lm.setMatrixAt(i * 2, tmp.m.compose(tmp.p.set(x, d * 0.22, z), IDENTITY, ONE));
        lm.setMatrixAt(i * 2 + 1, tmp.m.compose(tmp.p.set(x, -d * 0.22, z), IDENTITY, ONE));
      } else {
        lm.setMatrixAt(i, tmp.m.compose(tmp.p.set(x, 0, z), IDENTITY, ONE));
      }
      const yTop = d / 2 - rodLen / 2 + 0.012 + hoopShift * 0.85;
      rm.setMatrixAt(i * 2, tmp.m.compose(tmp.p.set(x, yTop, z), IDENTITY, ONE));
      rm.setMatrixAt(i * 2 + 1, tmp.m.compose(tmp.p.set(x, -yTop, z), IDENTITY, ONE));
    }
    lm.instanceMatrix.needsUpdate = true;
    rm.instanceMatrix.needsUpdate = true;
  };

  useFrame((_, delta) => {
    const e = kitState.explode;
    if (Math.abs(e - last.current) > 0.0005) {
      layoutLugs(e);
      last.current = e;
    }
    const hoopShift = e * (0.22 + d * 0.45);
    const headShift = e * (0.11 + d * 0.25);
    const energy = kitState.energy[id];
    // La peau s'enfonce puis revient (amortissement rapide).
    const flex = -0.006 * energy.value * Math.cos(energy.age * 55) * Math.exp(-energy.age * 9);
    if (topHoop.current) topHoop.current.position.y = d / 2 + hoopShift;
    if (bottomHoop.current) bottomHoop.current.position.y = -d / 2 - hoopShift;
    if (topHeadRef.current) topHeadRef.current.position.y = d / 2 + 0.001 + headShift + flex;
    if (bottomHeadRef.current) bottomHeadRef.current.position.y = -d / 2 - 0.001 - headShift;

    const glow = energy.value * 0.9;
    const target = topHead ?? mat.head;
    if ('emissiveIntensity' in target) {
      (target as MeshStandardMaterial).emissiveIntensity = glow;
    }

    // Onde circulaire sur la peau.
    if (ring.current) {
      const age = energy.age;
      const k = Math.min(1, age / 0.45);
      ring.current.position.y = d / 2 + 0.004 + headShift + flex;
      ring.current.scale.setScalar(r * (0.12 + 0.86 * Math.sqrt(k)));
      mat.ring.opacity = energy.value * (1 - k) * 0.95;
      ring.current.visible = mat.ring.opacity > 0.01;
    }

    // Surbrillance au survol ou quand la pièce est mise en avant.
    const lit = kitState.hovered === id || PIECE_IDS[kitState.focus] === id;
    mat.shell.emissive.copy(HIGHLIGHT);
    mat.shell.emissiveIntensity = MathUtils.damp(
      mat.shell.emissiveIntensity,
      lit ? 0.22 : 0,
      8,
      delta,
    );
  });

  const hoopMaterial = woodHoop ? mat.shell : mats.chrome;

  return (
    <group>
      <mesh geometry={geo.shell} material={mat.shell} castShadow receiveShadow />
      <mesh geometry={geo.inner} material={mats.wood} />
      <mesh ref={topHeadRef} geometry={geo.top} material={topHead ?? mat.head} receiveShadow />
      <mesh ref={bottomHeadRef} geometry={geo.bottom} material={woodHoop ? mat.head : mats.reso} />
      <mesh ref={topHoop} geometry={geo.hoop} material={hoopMaterial} castShadow />
      <mesh ref={bottomHoop} geometry={geo.hoop} material={hoopMaterial} rotation-x={Math.PI} />
      <instancedMesh ref={lugMesh} args={[geo.lug, mats.chrome, lugCount]} castShadow />
      <instancedMesh ref={rodMesh} args={[geo.rod, mats.chrome, lugs * 2]} />
      <mesh ref={ring} geometry={geo.ring} material={mat.ring} visible={false} />
    </group>
  );
}
