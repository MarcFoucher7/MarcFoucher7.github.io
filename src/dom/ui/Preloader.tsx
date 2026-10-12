import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { lockScroll, prefersReducedMotion } from '../../animation/lenis';
import { useT } from '../../i18n';
import { useApp } from '../../store/app';

const pad = (n: number): string => String(Math.round(n)).padStart(3, '0');

/**
 * Preloader court (1,2 s minimum, 4 s maximum) : compteur réel basé sur les polices
 * et la première image de la scène, puis rideau qui se lève sur le hero.
 */
export function Preloader() {
  const t = useT();
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      useApp.getState().setLoaded();
      setGone(true);
      return;
    }
    lockScroll(true);
    const started = performance.now();
    let fonts = false;
    let value = 0;
    let exiting = false;
    void document.fonts.ready.then(() => {
      fonts = true;
    });

    const exit = (): void => {
      exiting = true;
      gsap
        .timeline({
          onComplete: () => {
            lockScroll(false);
            setGone(true);
          },
        })
        .to('.preloader__count-inner', { yPercent: -110, duration: 0.6, ease: 'expo.in' })
        .to(
          '.preloader__line',
          { yPercent: -110, duration: 0.5, ease: 'expo.in', stagger: 0.04 },
          0,
        )
        .add(() => useApp.getState().setLoaded(), 0.45)
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, 0.35);
    };

    const tick = (): void => {
      if (exiting) return;
      const elapsed = performance.now() - started;
      const sceneReady = useApp.getState().scene !== 'pending';
      let goal = 30 + Math.min(elapsed / 2500, 1) * 55;
      if (fonts) goal += 5;
      if (fonts && sceneReady) goal = 100;
      if (elapsed > 4000) goal = 100;
      goal = Math.min(goal, (elapsed / 1200) * 100);
      value += (goal - value) * 0.12;
      if (count.current) count.current.textContent = pad(value);
      if (value > 99.4) {
        if (count.current) count.current.textContent = '100';
        exit();
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      lockScroll(false);
    };
  }, []);

  if (gone) return null;

  return (
    <div className="preloader" ref={root}>
      <p className="visually-hidden" role="status">
        {t.preloader.label}
      </p>
      <div className="preloader__row" aria-hidden="true">
        <span className="preloader__mask">
          <span className="preloader__line">Marc Foucher</span>
        </span>
        <span className="preloader__mask">
          <span className="preloader__line">{t.preloader.edition}</span>
        </span>
      </div>
      <div className="preloader__row preloader__row--bottom" aria-hidden="true">
        <span className="preloader__mask">
          <span className="preloader__line">{t.preloader.label}</span>
        </span>
        <span className="preloader__count">
          <span className="preloader__count-inner" ref={count}>
            000
          </span>
        </span>
      </div>
    </div>
  );
}
