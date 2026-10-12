import { lazy, Suspense, useEffect, useState } from 'react';
import { useT } from '../i18n';
import { useApp } from '../store/app';

const Experience = lazy(() => import('./Experience'));

/** Vrai si le navigateur peut créer un contexte WebGL. */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Hôte de la scène : la 3D n'est chargée qu'après le premier rendu du DOM,
 * quand le navigateur est inactif. Sans WebGL, une illustration statique la remplace.
 */
export function SceneHost() {
  const t = useT();
  const scene = useApp((s) => s.scene);
  const setScene = useApp((s) => s.setScene);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (!hasWebGL()) {
      setScene('static');
      return;
    }
    // Le contenu passe d'abord : la 3D attend la fin du chargement puis un moment d'inactivité.
    let idle = 0;
    let timer = 0;
    const start = (): void => setLoad(true);
    const schedule = (): void => {
      if ('requestIdleCallback' in window) {
        idle = window.requestIdleCallback(start, { timeout: 2000 });
      } else {
        timer = (window as Window).setTimeout(start, 600);
      }
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      window.removeEventListener('load', schedule);
      if (idle) window.cancelIdleCallback(idle);
      if (timer) (window as Window).clearTimeout(timer);
    };
  }, [setScene]);

  return (
    <div className="scene-host" data-ready={scene !== 'pending'}>
      {scene === 'static' ? (
        <svg className="scene-fallback" viewBox="0 0 400 160" role="img" aria-label={t.fallback}>
          <rect
            x="10"
            y="30"
            width="150"
            height="96"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="240"
            y="30"
            width="150"
            height="96"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M160 78 Q200 30 240 78"
            fill="none"
            stroke="#2bc4d8"
            strokeWidth="2"
            strokeDasharray="4 7"
          />
          <rect x="195" y="49" width="10" height="10" fill="#ff6b2c" />
        </svg>
      ) : null}
      {load ? (
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      ) : null}
    </div>
  );
}
