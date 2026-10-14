import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { WebGLRenderer } from 'three';
import '@fontsource-variable/big-shoulders-display/wght';
import '@fontsource-variable/schibsted-grotesk/wght.css';
import '@fontsource/jetbrains-mono/400.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/home.css';
import { App } from './App';
import { kitState } from './canvas/state';
import { useApp } from './store/app';

declare global {
  interface Window {
    __studio?: {
      kitState: typeof kitState;
      useApp: typeof useApp;
      ScrollTrigger: typeof ScrollTrigger;
      gl?: WebGLRenderer;
    };
  }
}

// Outil de mise au point : ?debug expose l'état de la scène dans la console.
if (new URLSearchParams(window.location.search).has('debug')) {
  window.__studio = { kitState, useApp, ScrollTrigger };
}

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
