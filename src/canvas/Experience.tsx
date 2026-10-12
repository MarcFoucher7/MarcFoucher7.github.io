import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { prefersReducedMotion } from '../animation/lenis';
import { useApp } from '../store/app';
import { CAMERA, particleCount } from './config';
import { Particles } from './Particles';

/** Abaisse la résolution puis le nombre de particules si le framerate s'effondre. */
function PerformanceGuard() {
  const setDpr = useThree((s) => s.setDpr);
  const samples = useRef({ time: 0, frames: 0, strikes: 0 });
  useFrame((_, delta) => {
    const s = samples.current;
    s.time += delta;
    s.frames += 1;
    if (s.time < 2) return;
    const fps = s.frames / s.time;
    s.time = 0;
    s.frames = 0;
    if (fps < 38) {
      s.strikes += 1;
      if (s.strikes === 1) setDpr(1);
      if (s.strikes === 2) useApp.getState().setQuality('low');
    }
  });
  return null;
}

/** Signale que la première image est rendue (fin du preloader possible). */
function FirstFrame() {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(() => useApp.getState().setScene('live'));
  });
  return null;
}

/** Canvas unique, fixe derrière le DOM. */
export default function Experience() {
  const reduced = prefersReducedMotion();
  const count = particleCount(window.innerWidth < 900);

  useEffect(() => {
    if (reduced) useApp.getState().setScene('live');
  }, [reduced]);

  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 1.75]}
      camera={{ fov: CAMERA.fov, position: [0, 0, CAMERA.z], near: 0.1, far: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
    >
      <Particles count={count} reduced={reduced} />
      <FirstFrame />
      <PerformanceGuard />
    </Canvas>
  );
}
