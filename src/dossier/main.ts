import '@fontsource-variable/big-shoulders-display/wght';
import '@fontsource-variable/schibsted-grotesk/wght.css';
import '../styles/tokens.css';
import '../styles/base.css';
import './dossier.css';
import { writeStorage } from '../store/storage';

/** Page Dossier S3 : HTML statique, seuls la langue et le thème sont pilotés en JS. */
const root = document.documentElement;

document.querySelector('[data-toggle="lang"]')?.addEventListener('click', () => {
  const lang = root.lang === 'en' ? 'fr' : 'en';
  root.lang = lang;
  writeStorage('local', 'lang', lang);
});

document.querySelector('[data-toggle="theme"]')?.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = theme;
  writeStorage('local', 'theme', theme);
});
