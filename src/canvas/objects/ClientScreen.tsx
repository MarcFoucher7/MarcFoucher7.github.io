import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import monoFont from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff?url';
import { Color, MathUtils, type Group, type MeshBasicMaterial } from 'three';
import { CODE, COLORS, SCREEN } from '../config';
import { CodeLines, type CodeLine } from './CodeLines';

export interface ClientScreenHandle {
  group: Group | null;
  /** Fait clignoter le cadre (réception d'un paquet). */
  flash: () => void;
}

interface ClientScreenProps {
  label: string;
  lines: CodeLine[];
  palette: { body: string; screen: string; ink: string; muted: string; edge: string };
  valueColor: string;
  online: boolean;
}

const flashColor = new Color(COLORS.ack);

/** Un « client » : écran flottant qui affiche l'état reçu sous forme de code. */
export const ClientScreen = forwardRef<ClientScreenHandle, ClientScreenProps>(function ClientScreen(
  { label, lines, palette, valueColor, online },
  ref,
) {
  const group = useRef<Group>(null);
  const frame = useRef<MeshBasicMaterial>(null);
  const flashLevel = useRef(0);
  const base = useRef(new Color());

  useImperativeHandle(ref, () => ({
    get group() {
      return group.current;
    },
    flash: () => {
      flashLevel.current = 1;
    },
  }));

  useFrame((_, delta) => {
    const mat = frame.current;
    if (!mat) return;
    flashLevel.current = MathUtils.damp(flashLevel.current, 0, 5, delta);
    base.current.set(palette.edge);
    mat.color.copy(base.current).lerp(flashColor, flashLevel.current);
  });

  const { w, h, d, radius, pad } = SCREEN;
  const front = d / 2 + 0.002;

  return (
    <group ref={group}>
      <RoundedBox args={[w, h, d]} radius={radius} smoothness={4}>
        <meshStandardMaterial color={palette.body} roughness={0.42} metalness={0.08} />
      </RoundedBox>
      {/* Cadre (clignote à la réception) puis dalle d'écran */}
      <mesh position={[0, -0.06, front - 0.001]}>
        <planeGeometry args={[w - pad + 0.02, h - pad - 0.1]} />
        <meshBasicMaterial ref={frame} color={palette.edge} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.06, front]}>
        <planeGeometry args={[w - pad, h - pad - 0.12]} />
        <meshBasicMaterial color={palette.screen} toneMapped={false} />
      </mesh>
      <Text
        font={monoFont}
        fontSize={CODE.size * 0.85}
        position={[-w / 2 + pad / 2 + 0.02, h / 2 - 0.085, front]}
        anchorX="left"
        anchorY="middle"
        color={palette.muted}
        material-toneMapped={false}
      >
        {label}
      </Text>
      <mesh position={[w / 2 - pad / 2 - 0.04, h / 2 - 0.085, front]}>
        <planeGeometry args={[0.055, 0.055]} />
        <meshBasicMaterial color={online ? COLORS.ack : COLORS.signal} toneMapped={false} />
      </mesh>
      <CodeLines
        lines={lines}
        colors={{ ink: palette.ink, muted: palette.muted, value: valueColor }}
        x={-w / 2 + pad / 2 + 0.1}
        y={h / 2 - 0.25}
        z={front + 0.001}
      />
    </group>
  );
});
