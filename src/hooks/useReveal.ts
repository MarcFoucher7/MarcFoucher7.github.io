import { type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../animation/lenis';
import { useApp } from '../store/app';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Révèle les lignes d'un titre (masque + translation) à son entrée dans l'écran.
 * autoSplit re-découpe après chargement des polices et au redimensionnement.
 */
export function useReveal(ref: RefObject<HTMLElement>, options: { delay?: number } = {}): void {
  const lang = useApp((s) => s.lang);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.2,
            ease: 'expo.out',
            stagger: 0.08,
            delay: options.delay ?? 0,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }),
      });
      return () => split.revert();
    },
    { dependencies: [lang], revertOnUpdate: true },
  );
}
