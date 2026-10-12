import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../../animation/lenis';
import { links } from '../../content/profile';
import { useT } from '../../i18n';
import { useApp } from '../../store/app';
import { useFitText } from '../../hooks/useFitText';

const NAME = ['Marc', 'Foucher'];

/** Hero : nom géant pleine largeur, posé sur le globe de particules. */
export function Hero() {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const loaded = useApp((s) => s.loaded);
  const ref = useRef<HTMLElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  useFitText(name);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      if (!loaded) {
        gsap.set('.hero__char', { yPercent: 115 });
        gsap.set('.hero__fade', { autoAlpha: 0, y: 14 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .to('.hero__char', { yPercent: 0, duration: 1.4, stagger: 0.045 }, 0.1)
        .to('.hero__fade', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.5);

      // En quittant le hero, le nom s'éloigne légèrement (parallaxe).
      gsap.to('.hero__name', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    { scope: ref, dependencies: [loaded] },
  );

  return (
    <section id="hero" className="hero" ref={ref} tabIndex={-1} aria-labelledby="hero-title">
      <div className="hero__top">
        <p className="hero__kicker hero__fade">{t.hero.kicker}</p>
        <p className="hero__intro hero__fade">{t.hero.intro}</p>
      </div>
      <div className="hero__bottom">
        <div className="hero__meta">
          <span className="hero__fade hero__scroll">({t.hero.scroll})</span>
          <span className="hero__fade hero__tags">{t.hero.tags}</span>
          <a
            className="hero__fade hero__cv"
            href={lang === 'fr' ? links.cvFr : links.cvEn}
            target="_blank"
            rel="noopener"
            data-cursor="PDF"
          >
            {t.hero.cv}
          </a>
        </div>
        <h1 className="hero__name" id="hero-title" aria-label="Marc Foucher" ref={name}>
          {NAME.map((word) => (
            <span className="hero__word" key={word} aria-hidden="true">
              {[...word].map((char, i) => (
                <span className="hero__char-mask" key={i}>
                  <span className="hero__char">{char}</span>
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
