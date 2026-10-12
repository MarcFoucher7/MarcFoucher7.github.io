import { lazy, Suspense, useEffect, useState } from 'react';
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
 * Hôte de la scène : charge la 3D pendant le preloader.
 * Sans WebGL, le site reste complet (le preloader se termine sans scène).
 */
export function SceneHost() {
  const setScene = useApp((s) => s.setScene);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    const ok = hasWebGL();
    setWebgl(ok);
    if (!ok) setScene('static');
  }, [setScene]);

  return (
    <div className="scene" aria-hidden="true">
      {webgl ? (
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      ) : null}
    </div>
  );
}
