import { useLayoutEffect, type RefObject } from 'react';
import { useApp } from '../store/app';

interface FitOptions {
  /** Taille maximale en px. */
  max?: number;
  min?: number;
  /** Largeur réservée à d'autres éléments sur la même ligne (px). */
  reserve?: number;
}

/**
 * Ajuste la taille de police pour que le texte remplisse exactement la largeur disponible
 * (titres géants pleine largeur). Recalcule au redimensionnement, au chargement des polices
 * et au changement de langue.
 */
export function useFitText(
  ref: RefObject<HTMLElement>,
  { max = 2000, min = 24, reserve = 0 }: FitOptions = {},
): void {
  const lang = useApp((s) => s.lang);
  useLayoutEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    const fit = (): void => {
      const cs = getComputedStyle(host);
      const avail =
        host.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - reserve;
      el.style.fontSize = '100px';
      el.style.width = 'max-content';
      const natural = el.getBoundingClientRect().width;
      el.style.width = '';
      if (natural <= 0) return;
      const size = Math.max(min, Math.min(max, (100 * avail) / natural));
      el.style.fontSize = `${size.toFixed(2)}px`;
    };

    fit();
    void document.fonts.ready.then(fit);
    const observer = new ResizeObserver(fit);
    observer.observe(host);
    return () => observer.disconnect();
  }, [ref, max, min, reserve, lang]);
}
