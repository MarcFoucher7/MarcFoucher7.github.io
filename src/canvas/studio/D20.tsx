import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  EdgesGeometry,
  IcosahedronGeometry,
  LineBasicMaterial,
  MathUtils,
  MeshPhysicalMaterial,
  Quaternion,
  Vector3,
  type Group,
} from 'three';
import { useApp } from '../../store/app';

const SIZE = 0.085;
const TABLE_TOP = 0.615;
const UP = new Vector3(0, 1, 0);

/** Une orientation par étape : une face différente vers le haut, puis un quart de tour. */
function faceOrientations(): Quaternion[] {
  const g = new IcosahedronGeometry(1, 0);
  const pos = g.getAttribute('position');
  const normals: Vector3[] = [];
  for (let i = 0; i < pos.count; i += 3) {
    const a = new Vector3().fromBufferAttribute(pos, i);
    const b = new Vector3().fromBufferAttribute(pos, i + 1);
    const c = new Vector3().fromBufferAttribute(pos, i + 2);
    normals.push(a.add(b).add(c).normalize());
  }
  g.dispose();
  return [0, 7, 13, 4, 17, 10].map((index, k) => {
    const n = normals[index] as Vector3;
    const q = new Quaternion().setFromUnitVectors(n, UP);
    return new Quaternion().setFromAxisAngle(UP, k * 1.3).multiply(q);
  });
}

/**
 * Le D20 posé sur le guéridon, clin d'œil aux dés 3D du stage ALL4TEC :
 * il roule (slerp de quaternions) à chaque étape de l'étude de cas.
 */
export function D20() {
  const ref = useRef<Group>(null);
  const geo = useMemo(() => {
    const solid = new IcosahedronGeometry(SIZE, 0);
    return { solid, edges: new EdgesGeometry(solid) };
  }, []);
  const mat = useMemo(
    () => ({
      solid: new MeshPhysicalMaterial({
        color: '#ff8a2a',
        roughness: 0.18,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        flatShading: true,
        emissive: '#ff5a1a',
        emissiveIntensity: 0.12,
      }),
      edges: new LineBasicMaterial({ color: '#ffe2bd', transparent: true, opacity: 0.85 }),
    }),
    [],
  );
  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      Object.values(mat).forEach((m) => m.dispose());
    },
    [geo, mat],
  );
  const orientations = useMemo(() => faceOrientations(), []);
  const roll = useRef({ step: -1, age: 9 });

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    const { stageStep } = useApp.getState();
    if (stageStep !== roll.current.step) {
      roll.current = { step: stageStep, age: 0 };
    }
    roll.current.age += delta;
    const target = orientations[stageStep] ?? (orientations[0] as Quaternion);
    g.quaternion.slerp(target, 1 - Math.exp(-delta * 7));
    // Petit saut au lancer.
    const t = roll.current.age;
    const hop = t < 0.5 ? Math.sin((t / 0.5) * Math.PI) * 0.08 : 0;
    g.position.y = MathUtils.lerp(
      g.position.y,
      TABLE_TOP + SIZE * 0.8 + hop,
      1 - Math.exp(-delta * 18),
    );
  });

  return (
    <group ref={ref} position={[-1.35, TABLE_TOP + SIZE * 0.8, 0.55]}>
      <mesh geometry={geo.solid} material={mat.solid} castShadow />
      <lineSegments geometry={geo.edges} material={mat.edges} />
    </group>
  );
}
