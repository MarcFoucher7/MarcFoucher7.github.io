import { create } from 'zustand';
import { readStorage, writeStorage } from './storage';

export type Lang = 'fr' | 'en';
export type Theme = 'light' | 'dark';
export type SectionId =
  | 'hero'
  | 'stage'
  | 'projects'
  | 'skills'
  | 'background'
  | 'beyond'
  | 'contact';
export type Connection = 'connecting' | 'reconnecting' | 'connected';
export type Quality = 'high' | 'low';
/** pending : scène pas encore chargée ; live : WebGL actif ; static : pas de WebGL, illustration. */
export type SceneMode = 'pending' | 'live' | 'static';

/** Instantané d'état envoyé du client A au client B. */
export interface SyncedState {
  section: SectionId;
  lang: Lang;
  theme: Theme;
}

export const SECTION_IDS: readonly SectionId[] = [
  'hero',
  'stage',
  'projects',
  'skills',
  'background',
  'beyond',
  'contact',
];

interface AppState {
  lang: Lang;
  theme: Theme;
  /** Section visible, publiée par le DOM et lue par la scène 3D. */
  section: SectionId;
  /** État effectivement « reçu » par le client B, après le trajet du paquet. */
  synced: SyncedState;
  syncCount: number;
  connection: Connection;
  quality: Quality;
  scene: SceneMode;
  setLang: (lang: Lang) => void;
  toggleTheme: () => void;
  setSection: (section: SectionId) => void;
  acknowledge: (state: SyncedState) => void;
  setConnection: (connection: Connection) => void;
  setQuality: (quality: Quality) => void;
  setScene: (scene: SceneMode) => void;
}

/** Valeurs initiales posées par le script inline de index.html (pas de flash au chargement). */
const initialLang: Lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
const initialTheme: Theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

export const useApp = create<AppState>()((set, get) => ({
  lang: initialLang,
  theme: initialTheme,
  section: 'hero',
  synced: { section: 'hero', lang: initialLang, theme: initialTheme },
  syncCount: 0,
  connection: readStorage('session', 'reconnectionToken') ? 'reconnecting' : 'connecting',
  quality: 'high',
  scene: 'pending',
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
  acknowledge: (synced) => set((s) => ({ synced, syncCount: s.syncCount + 1 })),
  setConnection: (connection) => {
    if (connection === 'connected')
      writeStorage('session', 'reconnectionToken', String(Date.now()));
    set({ connection });
  },
  setQuality: (quality) => set({ quality }),
  setScene: (scene) => set({ scene }),
}));
