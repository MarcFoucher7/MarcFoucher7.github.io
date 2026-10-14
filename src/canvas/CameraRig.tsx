import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3, type PerspectiveCamera } from 'three';
import { prefersReducedMotion } from '../animation/lenis';
import { useApp, type SectionId } from '../store/app';
import { scrollState } from '../store/scroll';
import { kitState } from './state';

type V3 = [number, number, number];

const Y_AXIS = new Vector3(0, 1, 0);

interface Shot {
  pos: V3;
  target: V3;
  fov: number;
  /** Décalage horizontal du cadre (fraction de la largeur) : place le sujet à droite du texte. */
  shift: number;
}

/** Plans de caméra par section (grand écran / mobile). */
const SHOTS: Record<SectionId, { desktop: Shot; mobile: Shot }> = {
  hero: {
    desktop: { pos: [2.55, 1.32, 3.78], target: [-0.1, 0.52, -0.05], fov: 34, shift: -0.15 },
    mobile: { pos: [1.7, 1.5, 4.7], target: [0, 0.02, 0], fov: 46, shift: 0 },
  },
  intro: {
    desktop: { pos: [0.85, 0.48, 1.5], target: [0.02, 0.32, 0.25], fov: 32, shift: -0.21 },
    mobile: { pos: [0.6, 0.6, 1.9], target: [0, 0.34, 0.25], fov: 42, shift: 0 },
  },
  kit: {
    desktop: { pos: [2.52, 2.1, 4.15], target: [-0.08, 0.95, 0], fov: 39, shift: -0.15 },
    mobile: { pos: [2.0, 2.4, 5.6], target: [0, 1.2, 0], fov: 50, shift: 0 },
  },
  stage: {
    desktop: { pos: [-0.62, 1.02, 1.45], target: [-1.35, 0.66, 0.52], fov: 28, shift: -0.16 },
    mobile: { pos: [-0.8, 1.15, 1.9], target: [-1.35, 0.66, 0.52], fov: 40, shift: 0 },
  },
  projects: {
    desktop: { pos: [1.55, 1.66, 1.6], target: [2.6, 1.7, -2.74], fov: 33, shift: -0.24 },
    mobile: { pos: [1.5, 1.62, 1.4], target: [2.65, 1.72, -2.74], fov: 44, shift: 0 },
  },
  background: {
    desktop: { pos: [-0.35, 3.55, 1.3], target: [-0.7, 0.25, -0.3], fov: 42, shift: -0.15 },
    mobile: { pos: [0.2, 4.2, 1.6], target: [0, 0.25, -0.3], fov: 52, shift: 0 },
  },
  beyond: {
    desktop: { pos: [0.02, 1.22, -1.02], target: [0, 0.8, 0.8], fov: 54, shift: -0.1 },
    mobile: { pos: [0.02, 1.22, -1.02], target: [0, 0.8, 0.8], fov: 62, shift: 0 },
  },
  contact: {
    desktop: { pos: [-2.3, 1.55, 3.45], target: [0.15, 0.85, 0], fov: 34, shift: -0.14 },
    mobile: { pos: [-1.8, 1.8, 4.8], target: [0, 0.95, 0], fov: 46, shift: 0 },
  },
};

/** Caméra chorégraphiée : un plan par section, transitions amorties, parallaxe et secousse. */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const reduced = useMemo(() => prefersReducedMotion(), []);
  // ?snap : la caméra saute directement au plan (captures et tests visuels).
  const snap = useMemo(() => new URLSearchParams(window.location.search).has('snap'), []);
  const cur = useRef<{ pos: Vector3; target: Vector3; fov: number; shift: number } | null>(null);
  const tmp = useMemo(
    () => ({ pos: new Vector3(), target: new Vector3(), offset: new Vector3() }),
    [],
  );

  useFrame((state, delta) => {
    const { section } = useApp.getState();
    const mobile = state.size.width < 900 || state.size.width / state.size.height < 0.9;
    const shot = SHOTS[section][mobile ? 'mobile' : 'desktop'];
    tmp.pos.set(...shot.pos);
    tmp.target.set(...shot.target);

    // Vue éclatée : la caméra tourne lentement autour de la batterie.
    if (section === 'kit') {
      const angle = 0.12 - kitState.explode * 0.42;
      tmp.offset.subVectors(tmp.pos, tmp.target).applyAxisAngle(Y_AXIS, angle);
      tmp.pos.copy(tmp.target).add(tmp.offset);
    }

    const c = cur.current ?? {
      pos: tmp.pos.clone(),
      target: tmp.target.clone(),
      fov: shot.fov,
      shift: shot.shift,
    };
    cur.current = c;
    const k = reduced || snap ? 1 : 1 - Math.exp(-Math.min(delta, 0.1) * 2.1);
    c.pos.lerp(tmp.pos, k);
    c.target.lerp(tmp.target, k);
    c.fov = MathUtils.lerp(c.fov, shot.fov, k);
    c.shift = MathUtils.lerp(c.shift, shot.shift, k);

    // Parallaxe douce au pointeur, respiration, secousse de grosse caisse.
    const t = state.clock.elapsedTime;
    const px = reduced ? 0 : scrollState.nx * 0.16 + Math.sin(t * 0.25) * 0.05;
    const py = reduced ? 0 : scrollState.ny * 0.08 + Math.sin(t * 0.33) * 0.025;
    const s = reduced ? 0 : kitState.shake * 0.006;
    camera.position.set(
      c.pos.x + px + (Math.random() - 0.5) * s,
      c.pos.y + py + (Math.random() - 0.5) * s,
      c.pos.z,
    );
    camera.lookAt(c.target);
    if (
      Math.abs(camera.fov - c.fov) > 0.01 ||
      Math.abs(camera.filmOffset - c.shift * camera.getFilmWidth()) > 0.01
    ) {
      camera.fov = c.fov;
      camera.filmOffset = c.shift * camera.getFilmWidth();
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
