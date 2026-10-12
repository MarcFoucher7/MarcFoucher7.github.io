import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Matrix4, Quaternion, Vector3, type InstancedMesh } from 'three';
import { COLORS, STREAM_COUNT } from '../config';
import { pointOnStream, rigState } from '../rig';

interface PacketStreamProps {
  scale: number;
  moving: boolean;
}

interface Particle {
  phase: number;
  speed: number;
  /** 1 = requête de A vers B, -1 = accusé de réception de B vers A. */
  dir: 1 | -1;
  wobble: number;
}

/** Flux continu de petits paquets : requêtes (cyan) vers B, accusés de réception (vert) vers A. */
export function PacketStream({ scale, moving }: PacketStreamProps) {
  const mesh = useRef<InstancedMesh>(null);
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: STREAM_COUNT }, (_, i) => ({
        phase: (i * 0.618034) % 1,
        speed: 0.16 + ((i * 7) % 11) * 0.012,
        dir: i % 3 === 0 ? -1 : 1,
        wobble: ((i * 13) % 17) / 17,
      })),
    [],
  );

  const tmp = useMemo(
    () => ({
      m: new Matrix4(),
      p: new Vector3(),
      q: new Quaternion(),
      s: new Vector3(),
      elapsed: 0,
    }),
    [],
  );

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const req = new Color(COLORS.signal).multiplyScalar(2.2);
    const ack = new Color(COLORS.ack).multiplyScalar(2.2);
    particles.forEach((particle, i) => m.setColorAt(i, particle.dir === 1 ? req : ack));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [particles]);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    if (moving) tmp.elapsed += delta * rigState.flow;
    const size = 0.034 * scale;
    particles.forEach((particle, i) => {
      const raw = (particle.phase + tmp.elapsed * particle.speed) % 1;
      const t = particle.dir === 1 ? raw : 1 - raw;
      pointOnStream(t, tmp.p);
      tmp.p.z += (particle.wobble - 0.5) * 0.18 * scale;
      tmp.p.y += Math.sin((t + particle.wobble) * Math.PI * 4) * 0.025 * scale;
      const visible = Math.sin(Math.PI * t) ** 0.6 * rigState.flow;
      tmp.s.setScalar(size * visible);
      tmp.m.compose(tmp.p, tmp.q, tmp.s);
      m.setMatrixAt(i, tmp.m);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, STREAM_COUNT]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}
