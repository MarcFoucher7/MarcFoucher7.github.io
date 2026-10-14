import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, Fog, Object3D, PMREMGenerator, type SpotLight } from 'three';
import { useApp, type Theme } from '../../store/app';
import { kitState } from '../state';
import { createStudioEnvironment, disposeEnvironment } from './environment';
import { KEY_LIGHT, RIM_LIGHT } from './lighting';

const LOOK: Record<
  Theme,
  {
    bg: string;
    fog: [number, number];
    ambient: number;
    hemi: number;
    key: number;
    rim: number;
    env: number;
  }
> = {
  dark: { bg: '#120608', fog: [5.5, 13], ambient: 0.16, hemi: 0.4, key: 55, rim: 16, env: 0.7 },
  light: { bg: '#e8d9c8', fog: [6, 16], ambient: 0.9, hemi: 1.3, key: 40, rim: 10, env: 0.75 },
};

/** Ambiance : fond, brouillard et reflets (environnement du studio généré, sans fichier HDR). */
export function Atmosphere() {
  const { scene, gl } = useThree();
  const theme = useApp((s) => s.theme);
  const look = LOOK[theme];

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const source = createStudioEnvironment(theme);
    const env = pmrem.fromScene(source, 0.035).texture;
    disposeEnvironment(source);
    scene.environment = env;
    return () => {
      env.dispose();
      pmrem.dispose();
      scene.environment = null;
    };
  }, [gl, scene, theme]);

  useEffect(() => {
    scene.background = new Color(look.bg);
    scene.fog = new Fog(look.bg, look.fog[0], look.fog[1]);
    scene.environmentIntensity = look.env;
  }, [scene, look]);

  return null;
}

/**
 * Éclairage studio : projecteur tungstène avec ombres, contre-jour sarcelle,
 * et une ambiance hémisphérique chaude. Tout pulse avec la musique.
 */
export function Lights({ shadows }: { shadows: boolean }) {
  const theme = useApp((s) => s.theme);
  const look = LOOK[theme];
  const key = useRef<SpotLight>(null);
  const rim = useRef<SpotLight>(null);
  const targets = useMemo(() => {
    const k = new Object3D();
    k.position.copy(KEY_LIGHT.target);
    const r = new Object3D();
    r.position.copy(RIM_LIGHT.target);
    return { k, r };
  }, []);

  useFrame(() => {
    const p = kitState.pulse;
    if (key.current) key.current.intensity = look.key * (1 + p * 0.35);
    if (rim.current) rim.current.intensity = look.rim * (1 + p * 0.6);
  });

  return (
    <>
      <primitive object={targets.k} />
      <primitive object={targets.r} />
      <ambientLight intensity={look.ambient} color="#ffd9b0" />
      <hemisphereLight args={['#ffd2a6', '#2a0c10', look.hemi]} />
      <spotLight
        ref={key}
        position={KEY_LIGHT.position}
        target={targets.k}
        angle={0.62}
        penumbra={0.7}
        decay={2}
        distance={12}
        color="#ffb066"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-near={0.5}
        shadow-camera-far={8}
      />
      <spotLight
        ref={rim}
        position={RIM_LIGHT.position}
        target={targets.r}
        angle={0.7}
        penumbra={1}
        decay={2}
        distance={10}
        color="#7fe3d8"
      />
    </>
  );
}
