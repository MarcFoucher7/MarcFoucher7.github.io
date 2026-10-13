import { useEffect } from 'react';
import { strike } from '../animation/cymbal';
import { useApp } from '../store/app';

/**
 * Déclenche les frappes : à la fin du preloader, à chaque changement de section,
 * et au clic dans le hero ou le contact (hors liens et boutons).
 */
export function useStrikes(): void {
  useEffect(() => {
    const unsub = useApp.subscribe((s, prev) => {
      if (s.loaded && !prev.loaded) window.setTimeout(() => strike(1), 500);
      else if (s.loaded && s.section !== prev.section) strike(0.55);
    });
    const onDown = (e: PointerEvent): void => {
      const { section, loaded } = useApp.getState();
      if (!loaded || (section !== 'hero' && section !== 'contact')) return;
      if ((e.target as HTMLElement).closest('a, button, input')) return;
      strike(1);
    };
    window.addEventListener('pointerdown', onDown);
    return () => {
      unsub();
      window.removeEventListener('pointerdown', onDown);
    };
  }, []);
}
