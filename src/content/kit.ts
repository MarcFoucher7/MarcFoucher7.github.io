import type { Localized } from '../i18n';
import type { PieceId } from '../kit/ids';
import { certifications, skills } from './profile';

export interface KitEntry {
  /** Nom de la pièce de batterie. */
  piece: Localized;
  /** Pourquoi cette pièce porte ce groupe de compétences. */
  role: Localized;
  /** Groupe de compétences. */
  title: Localized;
  items: Localized[];
}

const group = (fr: string): { title: Localized; items: Localized[] } => {
  const g = skills.find((s) => s.title.fr === fr);
  if (!g) throw new Error(`Groupe de compétences inconnu : ${fr}`);
  return { title: g.title, items: g.items };
};

/**
 * La vue éclatée : chaque pièce de la batterie porte un groupe de compétences.
 * Ordre = ordre de présentation au scroll.
 */
export const KIT_ORDER: PieceId[] = ['kick', 'snare', 'tom1', 'floor', 'hihat', 'crash', 'ride'];

export const kitContent: Record<PieceId, KitEntry> = {
  kick: {
    piece: { fr: 'Grosse caisse', en: 'Bass drum' },
    role: {
      fr: 'La pulsation sur laquelle tout repose.',
      en: 'The pulse everything else rests on.',
    },
    ...group('Java'),
    title: { fr: 'Fondations : Java et objet', en: 'Foundations: Java and OOP' },
  },
  snare: {
    piece: { fr: 'Caisse claire', en: 'Snare drum' },
    role: {
      fr: 'Celle qu’on entend le plus, au cœur du groove.',
      en: 'The one you hear most, at the heart of the groove.',
    },
    ...group('Web fullstack'),
  },
  tom1: {
    piece: { fr: 'Toms', en: 'Toms' },
    role: { fr: 'Les breaks qui font décoller le morceau.', en: 'The fills that lift the song.' },
    ...group('Temps réel et 3D'),
  },
  tom2: {
    piece: { fr: 'Toms', en: 'Toms' },
    role: { fr: 'Les breaks qui font décoller le morceau.', en: 'The fills that lift the song.' },
    ...group('Temps réel et 3D'),
  },
  floor: {
    piece: { fr: 'Tom basse', en: 'Floor tom' },
    role: {
      fr: 'Grave, stable, il tient la structure.',
      en: 'Low and steady, it holds the structure.',
    },
    ...group('Bases de données'),
  },
  hihat: {
    piece: { fr: 'Charleston', en: 'Hi-hat' },
    role: { fr: 'Le métronome du quotidien.', en: 'The everyday metronome.' },
    ...group('Outils et méthode'),
  },
  crash: {
    piece: { fr: 'Crash', en: 'Crash' },
    role: {
      fr: 'L’impact humain : on l’entend dans toute la pièce.',
      en: 'The human impact, heard across the room.',
    },
    title: { fr: 'Savoir-être', en: 'Soft skills' },
    items: [
      {
        fr: 'Relation client (5 ans sur les marchés)',
        en: 'Customer relations (5 years at markets)',
      },
      { fr: 'Autonomie', en: 'Autonomy' },
      { fr: 'Ponctualité', en: 'Punctuality' },
      { fr: 'Travail en binôme et en équipe Scrum', en: 'Pair work and Scrum teamwork' },
    ],
  },
  ride: {
    piece: { fr: 'Ride', en: 'Ride' },
    role: {
      fr: 'Le son qui dure : ce qui est validé et reste.',
      en: 'The sustained tone: what is certified and stays.',
    },
    title: { fr: 'Langues et certifications', en: 'Languages and certificates' },
    items: certifications,
  },
};
