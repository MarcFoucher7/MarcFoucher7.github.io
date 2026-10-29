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
  /** Nom court du groupe, pour la barre de progression. */
  short: Localized;
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
    short: { fr: 'Langages', en: 'Languages' },
    piece: { fr: 'Grosse caisse', en: 'Bass drum' },
    role: {
      fr: 'La pulsation sur laquelle tout repose.',
      en: 'The pulse everything else rests on.',
    },
    ...group('Langages'),
    title: { fr: 'Fondations : les langages', en: 'Foundations: languages' },
  },
  snare: {
    short: { fr: 'Web', en: 'Web' },
    piece: { fr: 'Caisse claire', en: 'Snare drum' },
    role: {
      fr: 'Celle qu’on entend le plus, au cœur du groove.',
      en: 'The one you hear most, at the heart of the groove.',
    },
    ...group('Web fullstack'),
  },
  tom1: {
    short: { fr: '3D et XR', en: '3D and XR' },
    piece: { fr: 'Toms', en: 'Toms' },
    role: { fr: 'Les breaks qui font décoller le morceau.', en: 'The fills that lift the song.' },
    ...group('3D, XR et temps réel'),
  },
  tom2: {
    short: { fr: '3D et XR', en: '3D and XR' },
    piece: { fr: 'Toms', en: 'Toms' },
    role: { fr: 'Les breaks qui font décoller le morceau.', en: 'The fills that lift the song.' },
    ...group('3D, XR et temps réel'),
  },
  floor: {
    short: { fr: 'Données', en: 'Data' },
    piece: { fr: 'Tom basse', en: 'Floor tom' },
    role: {
      fr: 'Grave, stable, il tient la structure.',
      en: 'Low and steady, it holds the structure.',
    },
    ...group('Données'),
  },
  hihat: {
    short: { fr: 'Qualité', en: 'Quality' },
    piece: { fr: 'Charleston', en: 'Hi-hat' },
    role: { fr: 'Le métronome du quotidien.', en: 'The everyday metronome.' },
    ...group('Tests, qualité et méthode'),
  },
  crash: {
    short: { fr: 'DevOps', en: 'DevOps' },
    piece: { fr: 'Crash', en: 'Crash' },
    role: {
      fr: 'L’accent qui marque chaque mise en production.',
      en: 'The accent that marks every release.',
    },
    ...group('DevOps'),
  },
  ride: {
    short: { fr: 'Savoir-être', en: 'Soft skills' },
    piece: { fr: 'Ride', en: 'Ride' },
    role: {
      fr: 'Le son qui dure : ce qui est acquis et reste.',
      en: 'The sustained tone: what is earned and stays.',
    },
    title: {
      fr: 'Langues, certifications et savoir-être',
      en: 'Languages, certificates, soft skills',
    },
    items: [
      ...certifications,
      { fr: 'Relation client (5 ans de marchés)', en: 'Customer relations (5 years at markets)' },
      { fr: 'Autonomie, ponctualité', en: 'Autonomy, punctuality' },
      { fr: 'Travail en équipe', en: 'Teamwork' },
    ],
  },
};
