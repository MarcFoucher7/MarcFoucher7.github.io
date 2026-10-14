import { useMemo, useRef, type ReactNode } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Euler, Quaternion, Vector3, type Group } from 'three';
import { hit } from '../../audio/hits';
import type { PieceId } from '../../kit/ids';
import { useApp } from '../../store/app';
import { kitState } from '../state';
import type { PieceSpec } from './layout';

interface PieceProps {
  id: PieceId;
  spec: PieceSpec;
  children: ReactNode;
}

/** Vrai si le pointeur est sur un élément d'interface : on ne joue pas à travers le texte. */
function blocked(e: ThreeEvent<PointerEvent | MouseEvent>): boolean {
  const target = e.nativeEvent.target as HTMLElement | null;
  const { menuOpen, loaded } = useApp.getState();
  return (
    Boolean(target?.closest?.('a, button, input, textarea, select, [data-ui]')) ||
    menuOpen ||
    !loaded
  );
}

/**
 * Pièce jouable : position éclatée, oscillation après frappe, survol et clic.
 * Souris et stylet jouent dès l'appui (réactivité) ; au toucher, on attend un vrai tap
 * pour ne pas jouer pendant le défilement.
 */
export function Piece({ id, spec, children }: PieceProps) {
  const ref = useRef<Group>(null);
  const data = useMemo(
    () => ({
      base: new Vector3(...spec.position),
      explode: new Vector3(...spec.explode),
      label: new Vector3(...spec.label),
      euler: new Euler(...spec.rotation),
      wobble: new Euler(),
      q: new Quaternion(),
      qw: new Quaternion(),
      v: new Vector3(),
      phase: Math.random() * Math.PI * 2,
    }),
    [spec],
  );
  const cymbal = spec.shape.kind !== 'drum';

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const e = kitState.explode;
    const energy = kitState.energy[id];
    g.position.copy(data.base).addScaledVector(data.explode, e);

    // Oscillation amortie : rapide pour les fûts, longue et ample pour les cymbales.
    const freq = cymbal ? 11 : 30;
    const decay = cymbal ? 2.2 : 8;
    const amp = spec.wobble * energy.value * Math.exp(-energy.age * decay) * 3;
    const w = amp * Math.sin(energy.age * freq + data.phase);
    const w2 = amp * Math.cos(energy.age * freq * 0.83 + data.phase);
    data.wobble.set(w, 0, w2 * 0.7);
    data.q.setFromEuler(data.euler).multiply(data.qw.setFromEuler(data.wobble));
    g.quaternion.copy(data.q);

    // Position écran de l'étiquette (vue éclatée).
    const label = kitState.labels[id];
    data.v.copy(g.position).add(data.label).project(state.camera);
    label.x = (data.v.x * 0.5 + 0.5) * state.size.width;
    label.y = (-data.v.y * 0.5 + 0.5) * state.size.height;
    label.visible = data.v.z < 1;
  });

  const play = (e: ThreeEvent<PointerEvent | MouseEvent>): void => {
    const open = id === 'hihat' && (e.nativeEvent as PointerEvent).shiftKey;
    hit(id, 0.85 + Math.random() * 0.15, open ? 'open' : 'closed');
  };

  return (
    <group
      ref={ref}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!blocked(e)) kitState.hovered = id;
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        if (kitState.hovered === id) kitState.hovered = null;
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (blocked(e) || e.pointerType === 'touch') return;
        play(e);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (blocked(e) || (e.nativeEvent as PointerEvent).pointerType !== 'touch' || e.delta > 10)
          return;
        play(e);
      }}
    >
      {children}
    </group>
  );
}
