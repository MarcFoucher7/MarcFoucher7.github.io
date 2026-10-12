import { Text } from '@react-three/drei';
import monoFont from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff?url';
import { CODE } from '../config';

export type Tone = 'ink' | 'muted' | 'value';

export interface CodeLine {
  parts: { text: string; tone: Tone }[];
}

interface CodeLinesProps {
  lines: CodeLine[];
  colors: Record<Tone, string>;
  x: number;
  y: number;
  z: number;
}

/**
 * Lignes de code en monospace. Chaque segment est un <Text> placé à la colonne exacte
 * (avance JetBrains Mono = 0,6 em), ce qui permet de colorer les valeurs.
 */
export function CodeLines({ lines, colors, x, y, z }: CodeLinesProps) {
  return (
    <group position={[x, y, z]}>
      {lines.map((line, row) => {
        let col = 0;
        return line.parts.map((part, i) => {
          const px = col * CODE.size * CODE.advance;
          col += part.text.length;
          if (!part.text.trim()) return null;
          return (
            <Text
              key={`${row}-${i}`}
              font={monoFont}
              fontSize={CODE.size}
              position={[px, -row * CODE.line, 0]}
              anchorX="left"
              anchorY="top"
              color={colors[part.tone]}
              whiteSpace="nowrap"
              material-toneMapped={false}
            >
              {part.text}
            </Text>
          );
        });
      })}
    </group>
  );
}
