import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import {
  BoxGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  TextureLoader,
} from 'three';
import { projects } from '../../content/profile';
import { kitState } from '../state';
import { ROOM } from './lighting';

/** Écran du studio, au mur : il affiche le projet survolé dans la section Projets. */
export function Monitor() {
  const textures = useLoader(
    TextureLoader,
    projects.map((p) => p.image),
  );
  useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = 4;
    });
  }, [textures]);

  const geo = useMemo(
    () => ({
      frame: new BoxGeometry(1.4, 0.82, 0.06),
      screen: new PlaneGeometry(1.32, 0.742),
    }),
    [],
  );
  const mat = useMemo(
    () => ({
      frame: new MeshStandardMaterial({ color: '#0b0a0b', roughness: 0.35, metalness: 0.4 }),
      screen: new MeshBasicMaterial({ toneMapped: false, color: '#ffffff' }),
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

  const shown = useRef(-1);
  const flash = useRef(0);
  useFrame((_, delta) => {
    const index = kitState.activeProject;
    if (index !== shown.current) {
      shown.current = index;
      const tex = textures[index] ?? textures[0];
      if (tex) {
        // Recadre l'image (cover) dans le 16:9 de l'écran.
        const img = tex.image as { width: number; height: number } | undefined;
        const ratio = img ? img.width / img.height : 16 / 9;
        const screen = 1.32 / 0.742;
        tex.repeat.set(ratio > screen ? screen / ratio : 1, ratio > screen ? 1 : ratio / screen);
        tex.offset.set((1 - tex.repeat.x) / 2, 1 - tex.repeat.y);
        mat.screen.map = tex;
        mat.screen.needsUpdate = true;
      }
      flash.current = 1;
    }
    // Petit flash de changement de chaîne.
    flash.current = Math.max(0, flash.current - delta * 4);
    const v = 0.82 + flash.current * 0.8;
    mat.screen.color.setRGB(v, v, v);
  });

  return (
    <group position={[2.65, 1.72, ROOM.back + 0.06]}>
      <mesh geometry={geo.frame} material={mat.frame} castShadow />
      <mesh geometry={geo.screen} material={mat.screen} position-z={0.032} />
    </group>
  );
}
