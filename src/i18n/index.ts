import { useApp, type Lang } from '../store/app';
import { en } from './en';
import { fr, type Dictionary } from './fr';

const dictionaries: Record<Lang, Dictionary> = { fr, en };

/** Retourne le dictionnaire de la langue active. */
export function useT(): Dictionary {
  return dictionaries[useApp((s) => s.lang)];
}

/** Texte disponible dans les deux langues. */
export interface Localized {
  fr: string;
  en: string;
}

/** Choisit la variante d'un texte localisé selon la langue active. */
export function useL(): (text: Localized) => string {
  const lang = useApp((s) => s.lang);
  return (text) => text[lang];
}
