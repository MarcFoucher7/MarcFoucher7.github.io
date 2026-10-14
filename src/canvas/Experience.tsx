import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import { useApp } from '../store/app';
import { CameraRig } from './CameraRig';
import { Effects } from './Effects';
import { Kit } from './kit/Kit';
import { D20 } from './studio/D20';
import { Atmosphere, Lights } from './studio/Lights';
import { Monitor } from './studio/Monitor';
import { Props } from './studio/Props';
import { Room } from './studio/Room';

/** Baisse la résolution puis coupe ombres et post-traitement si le framerate s'effondre. */
function PerformanceGuard() {
  const setDpr = useThree((s) => s.setDpr);
  // ?hq : qualité figée (captures d'écran de référence, image de partage).
  const locked = useMemo(() => new URLSearchParams(window.location.search).has('hq'), []);
  const samples = useRef({ time: 0, frames: 0, strikes: 0, skip: true });
  useEffect(() => {
    // Reprise après une pause (onglet masqué, menu ouvert) : on ne compte pas ce trou.
    const skip = (): void => {
      samples.current.skip = true;
    };
    document.addEventListener('visibilitychange', skip);
    const unsubscribe = useApp.subscribe((state, prev) => {
      if (state.menuOpen !== prev.menuOpen) skip();
    });
    return () => {
      document.removeEventListener('visibilitychange', skip);
      unsubscribe();
    };
  }, []);
  useFrame((_, delta) => {
    const s = samples.current;
    if (locked) return;
    if (s.skip) {
      s.skip = false;
      s.time = 0;
      s.frames = 0;
      return;
    }
    s.time += delta;
    s.frames += 1;
    if (s.time < 2.5) return;
    const fps = s.frames / s.time;
    s.time = 0;
    s.frames = 0;
    if (fps < 40) {
      s.strikes += 1;
      if (s.strikes === 1) setDpr(1);
      if (s.strikes === 2) useApp.getState().setQuality('low');
    }
  });
  return null;
}

/** ?debug : expose le renderer pour mesurer draw calls et triangles depuis la console. */
function DebugExpose() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    if (window.__studio) window.__studio.gl = gl;
  }, [gl]);
  return null;
}

/** Signale la première image rendue (fin possible du preloader). */
function FirstFrame() {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(() => useApp.getState().setScene('live'));
  });
  return null;
}

/**
 * Canvas unique et fixe. Les événements sont écoutés sur #root : la batterie reste
 * jouable même quand le DOM est au-dessus du canvas.
 */
export default function Experience() {
  const quality = useApp((s) => s.quality);
  const menuOpen = useApp((s) => s.menuOpen);
  const [paused, setPaused] = useState(false);
  const [source] = useState(() => document.getElementById('root') ?? undefined);
  const [mobile] = useState(
    () => window.innerWidth < 900 || window.matchMedia('(pointer: coarse)').matches,
  );
  const high = quality === 'high' && !mobile;

  useEffect(() => {
    if (mobile) useApp.getState().setQuality('low');
  }, [mobile]);

  // Menu plein écran : une fois qu'il recouvre tout, la scène cesse de se rendre.
  useEffect(() => {
    if (!menuOpen) {
      setPaused(false);
      return;
    }
    const id = window.setTimeout(() => setPaused(true), 1000);
    return () => window.clearTimeout(id);
  }, [menuOpen]);

  return (
    <Canvas
      aria-hidden="true"
      frameloop={paused ? 'never' : 'always'}
      eventSource={source}
      eventPrefix="client"
      dpr={high ? [1, 1.75] : [1, 1.4]}
      shadows={high ? { type: PCFSoftShadowMap } : false}
      camera={{ fov: 34, position: [2.25, 1.5, 3.35], near: 0.05, far: 40 }}
      gl={{
        antialias: !high,
        powerPreference: 'high-performance',
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
    >
      <Atmosphere />
      <Lights shadows={high} />
      <Suspense fallback={null}>
        <Room />
        <Props />
        <Kit />
        <D20 />
        <Monitor />
        {high ? <Effects /> : null}
        <FirstFrame />
      </Suspense>
      <CameraRig />
      <PerformanceGuard />
      <DebugExpose />
    </Canvas>
  );
}
