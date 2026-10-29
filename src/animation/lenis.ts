import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollState } from '../store/scroll';

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;

/** Vrai si l'utilisateur demande de réduire les animations. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Smooth scroll piloté par le ticker GSAP (une seule boucle d'animation). */
export function initLenis(): () => void {
  if (prefersReducedMotion()) return () => undefined;
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  const tick = (time: number): void => lenis.raf(time * 1000);
  lenis.on('scroll', (l: Lenis) => {
    scrollState.velocity = l.velocity;
    ScrollTrigger.update();
  });
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  instance = lenis;
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    instance = null;
  };
}

/** Bloque ou relâche le scroll (preloader, menu ouvert). */
export function lockScroll(locked: boolean): void {
  document.documentElement.classList.toggle('is-locked', locked);
  if (!instance) return;
  if (locked) instance.stop();
  else instance.start();
}

/** Fait défiler jusqu'à une ancre ou une position (px), en douceur si Lenis est actif. */
export function scrollToTarget(target: string | HTMLElement | number): void {
  if (typeof target === 'number') {
    if (instance)
      instance.scrollTo(target, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else window.scrollTo({ top: target });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (instance) {
    instance.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY });
  }
  el.focus({ preventScroll: true });
}
