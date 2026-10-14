/** Pièces de la batterie, partagées entre la scène 3D, l'audio et l'interface. */
export type PieceId = 'kick' | 'snare' | 'tom1' | 'tom2' | 'floor' | 'hihat' | 'crash' | 'ride';

/** Variante de jeu : charleston ouvert ou fermé. */
export type HitVariant = 'closed' | 'open';

export const PIECE_IDS: readonly PieceId[] = [
  'kick',
  'snare',
  'tom1',
  'tom2',
  'floor',
  'hihat',
  'crash',
  'ride',
];

/** Raccourcis clavier (KeyboardEvent.code) → pièce jouée. */
export const KEYMAP: Record<string, { piece: PieceId; variant?: HitVariant }> = {
  KeyB: { piece: 'kick' },
  KeyV: { piece: 'kick' },
  KeyS: { piece: 'snare' },
  KeyJ: { piece: 'snare' },
  KeyH: { piece: 'hihat' },
  KeyG: { piece: 'hihat', variant: 'open' },
  KeyT: { piece: 'tom1' },
  KeyY: { piece: 'tom2' },
  KeyF: { piece: 'floor' },
  KeyC: { piece: 'crash' },
  KeyR: { piece: 'ride' },
};

/** Touche affichée pour chaque pièce dans l'interface. */
export const KEY_LABEL: Record<PieceId, string> = {
  kick: 'B',
  snare: 'S',
  hihat: 'H',
  tom1: 'T',
  tom2: 'Y',
  floor: 'F',
  crash: 'C',
  ride: 'R',
};
