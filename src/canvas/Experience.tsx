import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { prefersReducedMotion } from '../animation/lenis';
import { useApp } from '../store/app';
import { CAMERA } from './config';
import { Effects } from './effects/Effects';
import { Scene } from './Scene';

/** Canvas unique, fixe derrière le DOM. Chargé en différé par <SceneHost>. */
export default function Experience() {
  const quality = useApp((s) => s.quality);
  const setQuality = useApp((s) => s.setQuality);
  const setScene = useApp((s) => s.setScene);
  const theme = useApp((s) => s.theme);
  const reduced = prefersReducedMotion();
  // Bloom uniquement sur grand écran en thème sombre : là où il se voit et où le GPU suit.
  const bloom = quality === 'high' && theme === 'dark' && window.innerWidth >= 1024;

  return (
    <Canvas
      aria-hidden="true"
      dpr={quality === 'high' ? [1, 2] : [1, 1.25]}
      camera={{ fov: CAMERA.fov, position: [0, 0, CAMERA.z], near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={() => {
        requestAnimationFrame(() => setScene('live'));
      }}
    >
      <PerformanceMonitor
        onDecline={() => setQuality('low')}
        onIncline={() => setQuality('high')}
      />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <Scene reduced={reduced} />
        {bloom ? <Effects /> : null}
      </Suspense>
    </Canvas>
  );
}
