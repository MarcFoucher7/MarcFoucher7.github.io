import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MathUtils, type Mesh } from 'three';
import { COLORS, PACKET_TRAVEL } from '../config';
import { pointOnStream } from '../stream';
import { useApp, type SyncedState } from '../../store/app';

interface StatePacketProps {
  scale: number;
  reduced: boolean;
  onArrive: () => void;
}

const glow = new Color(COLORS.accent).multiplyScalar(3);

/**
 * Paquet d'état : à chaque changement (section, langue, thème), un carré orange part de A
 * et l'état n'est affiché par B qu'à son arrivée.
 */
export function StatePacket({ scale, reduced, onArrive }: StatePacketProps) {
  const mesh = useRef<Mesh>(null);
  const flight = useRef<{ snapshot: SyncedState; t: number } | null>(null);
  const arrive = useRef(onArrive);
  arrive.current = onArrive;

  useEffect(() => {
    const snapshotOf = (): SyncedState => {
      const { section, lang, theme } = useApp.getState();
      return { section, lang, theme };
    };
    /** force : à la connexion, le serveur envoie toujours l'état complet. */
    const launch = (force = false): void => {
      const state = useApp.getState();
      if (state.connection !== 'connected') return;
      const snapshot = snapshotOf();
      const synced = state.synced;
      if (
        !force &&
        !flight.current &&
        synced.section === snapshot.section &&
        synced.lang === snapshot.lang &&
        synced.theme === snapshot.theme
      ) {
        return;
      }
      flight.current = { snapshot, t: 0 };
    };
    launch(true);
    return useApp.subscribe((s, prev) => {
      if (s.connection !== prev.connection) {
        launch(true);
      } else if (s.section !== prev.section || s.lang !== prev.lang || s.theme !== prev.theme) {
        launch();
      }
    });
  }, []);

  useFrame((_, delta) => {
    const m = mesh.current;
    const current = flight.current;
    if (!m) return;
    if (!current) {
      m.visible = false;
      return;
    }
    current.t = reduced ? 1 : Math.min(1, current.t + delta / PACKET_TRAVEL);
    const eased = MathUtils.smootherstep(current.t, 0, 1);
    pointOnStream(eased, m.position);
    m.scale.setScalar(0.085 * scale * (0.6 + Math.sin(Math.PI * current.t) * 0.6));
    m.rotation.set(eased * Math.PI, eased * Math.PI * 1.5, 0);
    m.visible = !reduced;
    if (current.t >= 1) {
      flight.current = null;
      useApp.getState().acknowledge(current.snapshot);
      arrive.current();
    }
  });

  return (
    <mesh ref={mesh} visible={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={glow} toneMapped={false} />
    </mesh>
  );
}
