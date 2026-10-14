import { Color, DoubleSide, MeshPhysicalMaterial, MeshStandardMaterial, type Texture } from 'three';
import { cymbalTexture, headTexture, sparkleTexture } from './textures';

/** Couleur de laque des fûts : vert émeraude pailleté. */
export const LACQUER = '#0d5b52';

export interface KitMaterials {
  lacquer: MeshPhysicalMaterial;
  wood: MeshStandardMaterial;
  chrome: MeshStandardMaterial;
  brass: MeshStandardMaterial;
  head: MeshStandardMaterial;
  headDot: MeshStandardMaterial;
  reso: MeshStandardMaterial;
  black: MeshStandardMaterial;
  leather: MeshStandardMaterial;
  felt: MeshStandardMaterial;
  textures: Texture[];
}

/** Crée les matériaux partagés de la batterie (à disposer au démontage). */
export function createKitMaterials(): KitMaterials {
  const sparkle = sparkleTexture(LACQUER);
  sparkle.repeat.set(6, 2);
  const cym = cymbalTexture();
  const headTex = headTexture(false);
  const headDotTex = headTexture(true);

  return {
    lacquer: new MeshPhysicalMaterial({
      map: sparkle,
      color: '#ffffff',
      roughness: 0.32,
      metalness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 0.9,
    }),
    wood: new MeshStandardMaterial({ color: '#c08a55', roughness: 0.7, side: DoubleSide }),
    chrome: new MeshStandardMaterial({
      color: '#e8e8ea',
      metalness: 1,
      roughness: 0.14,
      envMapIntensity: 1.2,
    }),
    brass: new MeshStandardMaterial({
      map: cym,
      color: '#d7a24a',
      metalness: 1,
      roughness: 0.3,
      side: DoubleSide,
      envMapIntensity: 1,
    }),
    head: new MeshStandardMaterial({
      map: headTex,
      roughness: 0.85,
      emissive: new Color('#ffa53d'),
      emissiveIntensity: 0,
    }),
    headDot: new MeshStandardMaterial({
      map: headDotTex,
      roughness: 0.85,
      emissive: new Color('#ffa53d'),
      emissiveIntensity: 0,
    }),
    reso: new MeshStandardMaterial({
      color: '#1b1013',
      roughness: 0.45,
      metalness: 0.1,
      side: DoubleSide,
    }),
    black: new MeshStandardMaterial({ color: '#141114', roughness: 0.5, metalness: 0.6 }),
    leather: new MeshStandardMaterial({ color: '#1a1214', roughness: 0.62 }),
    felt: new MeshStandardMaterial({ color: '#7a2230', roughness: 1 }),
    textures: [sparkle, cym, headTex, headDotTex],
  };
}

export function disposeKitMaterials(m: KitMaterials): void {
  Object.values(m).forEach((v) => {
    if (Array.isArray(v)) v.forEach((t: Texture) => t.dispose());
    else if (v && typeof v === 'object' && 'dispose' in v) (v as { dispose: () => void }).dispose();
  });
}
