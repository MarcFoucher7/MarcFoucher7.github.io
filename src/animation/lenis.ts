import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;

/** Vrai si l'utilisateur demande de réduire les animations. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Initialise le smooth scroll synchronisé avec ScrollTrigger (sauf mouvement réduit). */
export function initLenis(): () => void {
  if (prefersReducedMotion()) return () => undefined;
  const lenis = new Lenis({ lerp: 0.11 });
  const tick = (time: number): void => lenis.raf(time * 1000);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  instance = lenis;
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    instance = null;
  };
}

/** Fait défiler jusqu'à une ancre, en douceur si Lenis est actif. */
export function scrollToTarget(target: string | HTMLElement): void {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const offset =
    -parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) * 16 || -64;
  if (instance) {
    instance.scrollTo(el, { offset, duration: 1.2 });
  } else {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
  }
  el.focus({ preventScroll: true });
}
