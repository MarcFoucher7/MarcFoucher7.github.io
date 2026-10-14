import { useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MeshStandardMaterial } from 'three';
import { onHit } from '../../audio/hits';
import { outputLevel } from '../../audio/engine';
import { PIECE_IDS } from '../../kit/ids';
import { prefersReducedMotion } from '../../animation/lenis';
import { useApp } from '../../store/app';
import { kitState } from '../state';
import { Cymbal, HiHat } from './Cymbal';
import { Drum } from './Drum';
import { PIECES } from './layout';
import { createKitMaterials, disposeKitMaterials } from './materials';
import { Piece } from './Piece';
import { Stands } from './Stands';
import { kickLogoTexture } from './textures';

/** Peau avant de la grosse caisse avec le logo (texture générée une fois les polices chargées). */
function useKickHead(): MeshStandardMaterial {
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.55,
        emissive: new Color('#ffffff'),
        emissiveIntensity: 0,
      }),
    [],
  );
  useEffect(() => {
    let alive = true;
    void kickLogoTexture('Big Shoulders Display Variable', 'JetBrains Mono').then((tex) => {
      if (!alive) {
        tex.dispose();
        return;
      }
      material.map = tex;
      material.emissiveMap = tex;
      material.needsUpdate = true;
    });
    return () => {
      alive = false;
      material.map?.dispose();
      material.dispose();
    };
  }, [material]);
  return material;
}

const ease = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** La batterie complète : pièces jouables, pieds, et logique partagée (énergie, éclatement). */
export function Kit() {
  const mats = useMemo(() => createKitMaterials(), []);
  useEffect(() => () => disposeKitMaterials(mats), [mats]);
  const kickHead = useKickHead();
  const [reduced] = useState(prefersReducedMotion);

  useEffect(
    () =>
      onHit(({ piece, velocity, variant }) => {
        const energy = kitState.energy[piece];
        energy.value = Math.min(1, Math.max(energy.value * 0.5, velocity));
        energy.age = 0;
        energy.open = variant === 'open';
        if (piece === 'kick') kitState.shake = Math.min(1, kitState.shake + velocity);
        kitState.pulse = Math.min(
          1.4,
          kitState.pulse + velocity * (piece === 'kick' || piece === 'crash' ? 0.9 : 0.45),
        );
      }),
    [],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    for (const id of PIECE_IDS) {
      const energy = kitState.energy[id];
      const cymbal = PIECES[id].shape.kind !== 'drum';
      energy.age += dt;
      energy.value *= Math.exp(-dt * (cymbal ? 1.6 : 4.5));
    }
    // Éclatement : interpolé, puis adouci par une courbe ease-in-out. Hors de la section
    // « kit », la batterie est toujours remontée (filet de sécurité si un callback est sauté).
    const target = useApp.getState().section === 'kit' ? kitState.explodeTarget : 0;
    const current = kitState.explode;
    const raw = reduced ? target : current + (ease(target) - current) * (1 - Math.exp(-dt * 4));
    kitState.explode = raw;
    kitState.pulse = Math.max(outputLevel() * 0.6, kitState.pulse * Math.exp(-dt * 5));
    kitState.shake *= Math.exp(-dt * 14);
  });

  return (
    <group>
      <Stands mats={mats} />
      {PIECE_IDS.map((id) => {
        const spec = PIECES[id];
        const shape = spec.shape;
        return (
          <Piece key={id} id={id} spec={spec}>
            {shape.kind === 'drum' ? (
              <Drum
                id={id}
                shape={shape}
                mats={mats}
                topHead={id === 'kick' ? kickHead : undefined}
              />
            ) : shape.kind === 'hihat' ? (
              <HiHat id={id} radius={shape.radius} mats={mats} />
            ) : (
              <Cymbal id={id} radius={shape.radius} bell={shape.bell} bow={shape.bow} mats={mats} />
            )}
          </Piece>
        );
      })}
    </group>
  );
}
