import { useEffect, useMemo } from 'react';
import { useApp } from '../store/app';
import { PALETTE } from './config';
import { Rig } from './Rig';
import type { CodeLine } from './objects/CodeLines';

const str = (value: string): string => `"${value}"`;

/** Lignes du client A : l'état local qu'il envoie. */
function linesForA(section: string, lang: string, theme: string): CodeLine[] {
  return [
    {
      parts: [
        { text: 'room', tone: 'ink' },
        { text: '.send(', tone: 'muted' },
        { text: '"state"', tone: 'value' },
        { text: ', {', tone: 'muted' },
      ],
    },
    {
      parts: [
        { text: '  section', tone: 'ink' },
        { text: ': ', tone: 'muted' },
        { text: str(section), tone: 'value' },
      ],
    },
    {
      parts: [
        { text: '  lang', tone: 'ink' },
        { text: ': ', tone: 'muted' },
        { text: str(lang), tone: 'value' },
      ],
    },
    {
      parts: [
        { text: '  theme', tone: 'ink' },
        { text: ': ', tone: 'muted' },
        { text: str(theme), tone: 'value' },
      ],
    },
    { parts: [{ text: '});', tone: 'muted' }] },
  ];
}

/** Lignes du client B : le dernier état reçu, ou l'attente de connexion. */
function linesForB(
  synced: { section: string; lang: string; theme: string },
  syncs: number,
  connection: 'connecting' | 'reconnecting' | 'connected',
): CodeLine[] {
  const head: CodeLine = {
    parts: [
      { text: 'onStateChange', tone: 'ink' },
      { text: '((s) => {', tone: 'muted' },
    ],
  };
  if (connection !== 'connected') {
    return [
      head,
      {
        parts: [
          {
            text: connection === 'reconnecting' ? '  // reconnect(token)…' : '  // connecting…',
            tone: 'muted',
          },
        ],
      },
      { parts: [{ text: '});', tone: 'muted' }] },
    ];
  }
  return [
    head,
    {
      parts: [
        { text: '  s.section', tone: 'ink' },
        { text: ' = ', tone: 'muted' },
        { text: str(synced.section), tone: 'value' },
      ],
    },
    {
      parts: [
        { text: '  s.lang', tone: 'ink' },
        { text: ' = ', tone: 'muted' },
        { text: str(synced.lang), tone: 'value' },
      ],
    },
    {
      parts: [
        { text: '  s.theme', tone: 'ink' },
        { text: ' = ', tone: 'muted' },
        { text: str(synced.theme), tone: 'value' },
      ],
    },
    {
      parts: [
        { text: '}); // ack #', tone: 'muted' },
        { text: String(syncs), tone: 'value' },
      ],
    },
  ];
}

interface SceneProps {
  reduced: boolean;
}

/** Composition : lumières et les deux clients synchronisés. */
export function Scene({ reduced }: SceneProps) {
  const theme = useApp((s) => s.theme);
  const lang = useApp((s) => s.lang);
  const section = useApp((s) => s.section);
  const synced = useApp((s) => s.synced);
  const syncCount = useApp((s) => s.syncCount);
  const connection = useApp((s) => s.connection);
  const setConnection = useApp((s) => s.setConnection);

  useEffect(() => {
    if (connection === 'connected') return;
    const id = window.setTimeout(
      () => setConnection('connected'),
      connection === 'reconnecting' ? 900 : 1400,
    );
    return () => window.clearTimeout(id);
  }, [connection, setConnection]);

  const palette = PALETTE[theme];
  const linesA = useMemo(() => linesForA(section, lang, theme), [section, lang, theme]);
  const linesB = useMemo(
    () => linesForB(synced, syncCount, connection),
    [synced, syncCount, connection],
  );

  return (
    <>
      <ambientLight intensity={theme === 'dark' ? 0.55 : 0.9} />
      <directionalLight position={[3, 5, 6]} intensity={theme === 'dark' ? 1.1 : 1.4} />
      <directionalLight position={[-4, 1, 3]} intensity={0.35} color="#2bc4d8" />
      <Rig
        palette={palette}
        linesA={linesA}
        linesB={linesB}
        connected={connection === 'connected'}
        reduced={reduced}
        labels={{ a: 'client A', b: 'client B' }}
      />
    </>
  );
}
