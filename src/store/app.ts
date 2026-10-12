import { create } from 'zustand';
import { writeStorage } from './storage';

export type Lang = 'fr' | 'en';
export type Theme = 'light' | 'dark';
export type SectionId =
  | 'hero'
  | 'intro'
  | 'stage'
  | 'projects'
  | 'skills'
  | 'background'
  | 'beyond'
  | 'contact';
export type Quality = 'high' | 'low';
/** pending : scène en chargement ; live : WebGL actif ; static : pas de WebGL. */
export type SceneMode = 'pending' | 'live' | 'static';

export const SECTION_IDS: readonly SectionId[] = [
  'hero',
  'intro',
  'stage',
  'projects',
  'skills',
  'background',
  'beyond',
  'contact',
];

/** Nombre d'étapes de l'étude de cas (une face du D20 par étape). */
export const STAGE_STEPS = 5;

interface AppState {
  lang: Lang;
  theme: Theme;
  /** Section visible, publiée par le DOM et lue par la scène. */
  section: SectionId;
  /** Étape active de l'étude de cas épinglée (0 → STAGE_STEPS - 1). */
  stageStep: number;
  /** Le preloader est terminé : l'intro peut jouer. */
  loaded: boolean;
  scene: SceneMode;
  quality: Quality;
  menuOpen: boolean;
  setLang: (lang: Lang) => void;
  toggleTheme: () => void;
  setSection: (section: SectionId) => void;
  setStageStep: (step: number) => void;
  setLoaded: () => void;
  setScene: (scene: SceneMode) => void;
  setQuality: (quality: Quality) => void;
  setMenuOpen: (open: boolean) => void;
}

/** Valeurs posées par le script inline de index.html, avant le premier rendu. */
const initialLang: Lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
const initialTheme: Theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

export const useApp = create<AppState>()((set, get) => ({
  lang: initialLang,
  theme: initialTheme,
  section: 'hero',
  stageStep: 0,
  loaded: false,
  scene: 'pending',
  quality: 'high',
  menuOpen: false,
  setLang: (lang) => {
    document.documentElement.lang = lang;
    writeStorage('local', 'lang', lang);
    set({ lang });
  },
  toggleTheme: () => {
    const theme: Theme = get().theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    writeStorage('local', 'theme', theme);
    set({ theme });
  },
  setSection: (section) => {
    if (get().section !== section) set({ section });
  },
  setStageStep: (stageStep) => {
    if (get().stageStep !== stageStep) set({ stageStep });
  },
  setLoaded: () => set({ loaded: true }),
  setScene: (scene) => set({ scene }),
  setQuality: (quality) => set({ quality }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));
