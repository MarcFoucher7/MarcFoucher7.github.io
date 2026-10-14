import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BoxGeometry,
  CatmullRomCurve3,
  Color,
  CurvePath,
  CylinderGeometry,
  InstancedMesh,
  LineCurve3,
  Matrix4,
  MeshStandardMaterial,
  PlaneGeometry,
  Quaternion,
  TubeGeometry,
  Vector3,
  type BufferGeometry,
  type Mesh,
} from 'three';
import { useApp } from '../../store/app';
import { ROOM, ROOM_COLORS } from './lighting';
import { merge } from '../kit/geometry';
import { floorTexture, rng, rugTexture } from '../kit/textures';
import { kitState } from '../state';

/** Dalle de mousse acoustique : quatre dièdres (prismes triangulaires). */
function foamTileGeometry(): BufferGeometry {
  const parts: BufferGeometry[] = [];
  for (let i = 0; i < 4; i++) {
    const prism = new CylinderGeometry(0.072, 0.072, 0.49, 3, 1);
    prism.scale(1, 1, 0.62);
    prism.translate(-0.1875 + i * 0.125, 0, 0.022);
    parts.push(prism);
  }
  return merge(parts);
}

/** Pose les dalles sur les murs en damier (orientation alternée), hors des zones réservées. */
function foamMatrices(): Matrix4[] {
  const out: Matrix4[] = [];
  const q = new Quaternion();
  const turn = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2);
  const s = new Vector3(1, 1, 1);
  const reserved = (x: number, y: number): boolean =>
    (Math.abs(x) < 1.4 && y > 0.7 && y < 2.95) || (x > 1.85 && x < 3.45 && y > 0.95 && y < 2.75);
  let n = 0;
  for (let x = -3.35; x <= 3.36; x += 0.5) {
    for (let y = 0.35; y < ROOM.ceiling - 0.2; y += 0.5) {
      if (reserved(x, y)) continue;
      q.set(0, 0, 0, 1);
      if (n++ % 2) q.multiply(turn);
      out.push(new Matrix4().compose(new Vector3(x, y, ROOM.back + 0.005), q.clone(), s));
    }
  }
  // Murs latéraux, face vers l'intérieur.
  for (const side of [-1, 1]) {
    const face = new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      side < 0 ? Math.PI / 2 : -Math.PI / 2,
    );
    for (let z = ROOM.back + 0.3; z < 3.4; z += 0.5) {
      for (let y = 0.35; y < ROOM.ceiling - 0.2; y += 0.5) {
        const qq = face.clone();
        if (n++ % 2) qq.multiply(turn);
        out.push(new Matrix4().compose(new Vector3(side * (ROOM.side - 0.005), y, z), qq, s));
      }
    }
  }
  return out;
}

/** Diffuseur « skyline » en bois derrière la batterie : blocs de profondeurs aléatoires. */
function diffuserMatrices(): { matrices: Matrix4[]; colors: Color[] } {
  const r = rng(61);
  const matrices: Matrix4[] = [];
  const colors: Color[] = [];
  const cols = 13;
  const rows = 7;
  const size = 0.18;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const depth = 0.04 + Math.floor(r() * 5) * 0.045;
      const x = (i - (cols - 1) / 2) * (size + 0.006);
      const y = 1.78 + (j - (rows - 1) / 2) * (size + 0.006);
      matrices.push(
        new Matrix4().compose(
          new Vector3(x, y, ROOM.back + 0.02 + depth / 2),
          new Quaternion(),
          new Vector3(1, 1, depth / 0.1),
        ),
      );
      const tone = 0.55 + r() * 0.5;
      colors.push(new Color('#7a4526').multiplyScalar(tone));
    }
  }
  return { matrices, colors };
}

/** Néon « MF » en tubes (lettres tracées point par point). */
function neonGeometry(): BufferGeometry {
  const strokes: [number, number][][] = [
    [
      [-0.46, 0],
      [-0.46, 0.46],
      [-0.29, 0.2],
      [-0.12, 0.46],
      [-0.12, 0],
    ],
    [
      [0.06, 0],
      [0.06, 0.46],
      [0.34, 0.46],
    ],
    [
      [0.06, 0.24],
      [0.27, 0.24],
    ],
  ];
  const parts = strokes.map((pts) => {
    const path = new CurvePath<Vector3>();
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i] as [number, number];
      const b = pts[i + 1] as [number, number];
      path.add(new LineCurve3(new Vector3(a[0], a[1], 0), new Vector3(b[0], b[1], 0)));
    }
    return new TubeGeometry(path, pts.length * 24, 0.013, 8, false);
  });
  return merge(parts);
}

/** Câbles au sol entre les micros et le mur. */
function cableGeometry(): BufferGeometry {
  const curves = [
    [
      [-1.15, 0.01, -1.25],
      [-1.6, 0.01, -1.6],
      [-2.0, 0.01, -2.2],
      [-2.4, 0.02, -2.75],
    ],
    [
      [0.3, 0.01, 0.6],
      [0.9, 0.01, 0.4],
      [1.6, 0.01, -0.6],
      [2.2, 0.01, -2.0],
      [2.5, 0.02, -2.75],
    ],
  ];
  return merge(
    curves.map(
      (pts) =>
        new TubeGeometry(
          new CatmullRomCurve3(pts.map(([x, y, z]) => new Vector3(x, y, z))),
          64,
          0.008,
          6,
          false,
        ),
    ),
  );
}

/** La pièce : sol, tapis, murs, mousse, diffuseur, néon, bandeau LED, câbles. */
export function Room() {
  const theme = useApp((s) => s.theme);
  const colors = ROOM_COLORS[theme];

  const geo = useMemo(
    () => ({
      floor: new PlaneGeometry(12, 12).rotateX(-Math.PI / 2),
      rug: new PlaneGeometry(3.1, 2.48).rotateX(-Math.PI / 2),
      back: new PlaneGeometry(ROOM.side * 2, ROOM.ceiling),
      side: new PlaneGeometry(8, ROOM.ceiling),
      ceiling: new PlaneGeometry(ROOM.side * 2, 8).rotateX(Math.PI / 2),
      foam: foamTileGeometry(),
      block: new BoxGeometry(0.18, 0.18, 0.1),
      neon: neonGeometry(),
      led: new BoxGeometry(ROOM.side * 2 - 0.2, 0.025, 0.025),
      cable: cableGeometry(),
    }),
    [],
  );

  const tex = useMemo(() => ({ floor: floorTexture(), rug: rugTexture() }), []);

  const mat = useMemo(
    () => ({
      floor: new MeshStandardMaterial({
        map: tex.floor,
        roughness: 0.5,
        metalness: 0.05,
        envMapIntensity: 0.35,
      }),
      rug: new MeshStandardMaterial({ map: tex.rug, roughness: 0.95 }),
      wall: new MeshStandardMaterial({ roughness: 0.95 }),
      foam: new MeshStandardMaterial({ roughness: 1, flatShading: true }),
      ceiling: new MeshStandardMaterial({ roughness: 1 }),
      wood: new MeshStandardMaterial({ roughness: 0.65, color: '#ffffff' }),
      neon: new MeshStandardMaterial({
        color: '#2a1206',
        emissive: new Color('#ffa53d'),
        emissiveIntensity: 3,
        toneMapped: false,
      }),
      led: new MeshStandardMaterial({
        color: '#000000',
        emissive: new Color('#ff8a2a'),
        emissiveIntensity: 2,
        toneMapped: false,
      }),
      cable: new MeshStandardMaterial({ color: '#0d0b0c', roughness: 0.55 }),
    }),
    [tex],
  );

  useEffect(() => {
    mat.wall.color.set(colors.wall);
    mat.foam.color.set(colors.foam);
    mat.ceiling.color.set(colors.ceiling);
    mat.led.emissive.set(colors.led);
  }, [colors, mat]);

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      Object.values(mat).forEach((m) => m.dispose());
      Object.values(tex).forEach((t) => t.dispose());
    },
    [geo, mat, tex],
  );

  const foam = useRef<InstancedMesh>(null);
  const diffuser = useRef<InstancedMesh>(null);
  const foamData = useMemo(() => foamMatrices(), []);
  const diffData = useMemo(() => diffuserMatrices(), []);

  useEffect(() => {
    const f = foam.current;
    if (f) {
      foamData.forEach((m, i) => f.setMatrixAt(i, m));
      f.instanceMatrix.needsUpdate = true;
    }
    const d = diffuser.current;
    if (d) {
      diffData.matrices.forEach((m, i) => d.setMatrixAt(i, m));
      diffData.colors.forEach((c, i) => d.setColorAt(i, c));
      d.instanceMatrix.needsUpdate = true;
      if (d.instanceColor) d.instanceColor.needsUpdate = true;
    }
  }, [foamData, diffData]);

  const neon = useRef<Mesh>(null);
  useFrame((state) => {
    const pulse = kitState.pulse;
    const flicker =
      0.94 +
      Math.sin(state.clock.elapsedTime * 47) * 0.03 +
      Math.sin(state.clock.elapsedTime * 13) * 0.03;
    mat.neon.emissiveIntensity = (theme === 'dark' ? 3 : 1.6) * flicker + pulse * 2.5;
    mat.led.emissiveIntensity = (theme === 'dark' ? 1.4 : 0.6) + pulse * 4;
  });

  return (
    <group>
      <mesh geometry={geo.floor} material={mat.floor} receiveShadow />
      <mesh geometry={geo.rug} material={mat.rug} position={[0, 0.003, -0.18]} receiveShadow />
      <mesh geometry={geo.back} material={mat.wall} position={[0, ROOM.ceiling / 2, ROOM.back]} />
      <mesh
        geometry={geo.side}
        material={mat.wall}
        position={[-ROOM.side, ROOM.ceiling / 2, 1.2]}
        rotation-y={Math.PI / 2}
      />
      <mesh
        geometry={geo.side}
        material={mat.wall}
        position={[ROOM.side, ROOM.ceiling / 2, 1.2]}
        rotation-y={-Math.PI / 2}
      />
      <mesh geometry={geo.ceiling} material={mat.ceiling} position={[0, ROOM.ceiling, 1.2]} />
      <instancedMesh ref={foam} args={[geo.foam, mat.foam, foamData.length]} receiveShadow />
      <instancedMesh
        ref={diffuser}
        args={[geo.block, mat.wood, diffData.matrices.length]}
        castShadow
        receiveShadow
      />
      <mesh
        ref={neon}
        geometry={geo.neon}
        material={mat.neon}
        position={[0, 2.72, ROOM.back + 0.09]}
      />
      <mesh geometry={geo.led} material={mat.led} position={[0, 0.03, ROOM.back + 0.06]} />
      <mesh
        geometry={geo.led}
        material={mat.led}
        position={[0, ROOM.ceiling - 0.04, ROOM.back + 0.06]}
      />
      <mesh geometry={geo.cable} material={mat.cable} />
    </group>
  );
}
