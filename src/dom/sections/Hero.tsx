import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../../animation/lenis';
import { links } from '../../content/profile';
import { useT } from '../../i18n';
import { useApp } from '../../store/app';
import { ConnectionStatus } from '../ui/ConnectionStatus';

const NAME_LINES = ['Marc', 'Foucher'];

/** Premier écran : nom, rôle, objectif et accès direct au CV. */
export function Hero() {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.hero__char', { yPercent: 110, duration: 1.1, stagger: 0.035 }, 0.15)
        .from(
          '.hero__role, .hero__lead',
          { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.08 },
          0.55,
        )
        .from('.hero .btn-row > *', { autoAlpha: 0, y: 12, duration: 0.8, stagger: 0.06 }, 0.75);
    },
    { scope: ref },
  );

  return (
    <section
      id="hero"
      className="section hero"
      ref={ref}
      tabIndex={-1}
      aria-labelledby="hero-title"
    >
      <div className="section__inner">
        <div className="column">
          <ConnectionStatus />
          <h1 className="hero__name" id="hero-title" aria-label="Marc Foucher">
            {NAME_LINES.map((line) => (
              <span className="hero__name-line" key={line} aria-hidden="true">
                {[...line].map((char, i) => (
                  <span className="hero__char" key={i}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="hero__role">{t.hero.role}</p>
          <p className="hero__lead">{t.hero.lead}</p>
          <div className="btn-row">
            <a
              className="btn btn--primary"
              href={lang === 'fr' ? links.cvFr : links.cvEn}
              target="_blank"
              rel="noopener"
            >
              {t.hero.cv}
            </a>
            <a className="btn btn--ghost" href={`mailto:${links.email}`}>
              {t.hero.contact}
            </a>
            <a className="text-link" href={links.letter} target="_blank" rel="noopener">
              {t.hero.letter}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
