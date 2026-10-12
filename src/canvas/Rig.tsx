import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3, type Group } from 'three';
import { SCREEN } from './config';
import { computeLayout, type RigLayout } from './layout';
import { rigState } from './stream';
import { scrollState } from '../store/scroll';
import { ClientScreen, type ClientScreenHandle } from './objects/ClientScreen';
import { PacketStream } from './objects/PacketStream';
import { StatePacket } from './objects/StatePacket';
import type { CodeLine } from './objects/CodeLines';

interface RigProps {
  palette: { body: string; screen: string; ink: string; muted: string; edge: string };
  linesA: CodeLine[];
  linesB: CodeLine[];
  connected: boolean;
  reduced: boolean;
  labels: { a: string; b: string };
}

const LAMBDA = 4.5;

/**
 * Positionne les deux clients selon le scroll et le viewport, et calcule
 * les ancrages du flux qui les relie.
 */
export function Rig({ palette, linesA, linesB, connected, reduced, labels }: RigProps) {
  const root = useRef<Group>(null);
  const a = useRef<ClientScreenHandle>(null);
  const b = useRef<ClientScreenHandle>(null);
  const viewport = useThree((s) => s.viewport);
  const current = useRef<RigLayout | null>(null);
  const tmp = useMemo(() => ({ v: new Vector3(), w: new Vector3(), mid: new Vector3() }), []);
  const scaleRef = useRef(1);

  useFrame((state, delta) => {
    const g = root.current;
    const ga = a.current?.group;
    const gb = b.current?.group;
    if (!g || !ga || !gb) return;

    const { width, height } = state.viewport.getCurrentViewport(state.camera, [0, 0, 0]);
    const target = computeLayout(width, height, scrollState.hero);
    const cur = current.current ?? { ...target };
    const k = reduced ? 1 : 1 - Math.exp(-LAMBDA * delta);
    (Object.keys(target) as (keyof RigLayout)[]).forEach((key) => {
      cur[key] = MathUtils.lerp(cur[key], target[key], k);
    });
    current.current = cur;
    scaleRef.current = cur.scale;

    // Groupe : position + légère parallaxe au pointeur (grand écran uniquement).
    g.position.set(cur.x, cur.y, 0);
    g.scale.setScalar(cur.scale);
    const desktop = width / height >= 1;
    const px = desktop && !reduced ? scrollState.pointerX : 0;
    const py = desktop && !reduced ? scrollState.pointerY : 0;
    g.rotation.y = MathUtils.damp(g.rotation.y, px * 0.12, 3, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, py * 0.07, 3, delta);

    // Les deux clients flottent légèrement, en opposition de phase.
    const t = state.clock.elapsedTime;
    const bob = reduced ? 0 : 0.045;
    ga.position.set(cur.ax / cur.scale, cur.ay / cur.scale + Math.sin(t * 0.9) * bob, 0);
    gb.position.set(
      -cur.ax / cur.scale,
      -cur.ay / cur.scale + Math.sin(t * 0.9 + Math.PI) * bob,
      0,
    );
    ga.rotation.y = cur.aRotY;
    gb.rotation.y = cur.bRotY;

    // Ancrages : bord droit de A → bord gauche de B (hero), bas de A → haut de B (contenu).
    const s = cur.stack;
    g.updateMatrixWorld();
    tmp.v.set(MathUtils.lerp(SCREEN.w / 2, 0, s), MathUtils.lerp(0, -SCREEN.h / 2, s), 0);
    ga.localToWorld(rigState.start.copy(tmp.v));
    tmp.w.set(MathUtils.lerp(-SCREEN.w / 2, 0, s), MathUtils.lerp(0, SCREEN.h / 2, s), 0);
    gb.localToWorld(rigState.end.copy(tmp.w));

    // Point de contrôle : arc vers le haut (horizontal) ou vers la gauche (vertical).
    const bulge = (0.55 + 0.25 * (1 - s)) * cur.scale;
    tmp.mid.addVectors(rigState.start, rigState.end).multiplyScalar(0.5);
    rigState.control.set(
      tmp.mid.x - bulge * s * 1.2,
      tmp.mid.y + bulge * (1 - s),
      tmp.mid.z + 0.35 * cur.scale,
    );

    rigState.flow = MathUtils.damp(rigState.flow, connected ? 1 : 0, 2.2, delta);
  });

  return (
    <>
      <group ref={root}>
        <ClientScreen
          ref={a}
          label={labels.a}
          lines={linesA}
          palette={palette}
          valueColor="#ff6b2c"
          online={connected}
        />
        <ClientScreen
          ref={b}
          label={labels.b}
          lines={linesB}
          palette={palette}
          valueColor="#2bc4d8"
          online={connected}
        />
      </group>
      <PacketStream scale={viewport.width / viewport.height < 1 ? 0.6 : 0.85} moving={!reduced} />
      <StatePacket
        scale={viewport.width / viewport.height < 1 ? 0.6 : 0.85}
        reduced={reduced}
        onArrive={() => b.current?.flash()}
      />
    </>
  );
}
