import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/syne/wght.css';
import '@fontsource-variable/schibsted-grotesk/wght.css';
import '@fontsource/jetbrains-mono/400.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/home.css';
import { App } from './App';

// Le contenu reste masqué tant que les polices ne sont pas prêtes : évite les sauts
// de mise en page (titres ajustés à la largeur) pendant le preloader.
const html = document.documentElement;
html.classList.add('fonts-loading');
const fontsReady = (): void => html.classList.remove('fonts-loading');
void document.fonts.ready.then(fontsReady);
window.setTimeout(fontsReady, 1500);

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
