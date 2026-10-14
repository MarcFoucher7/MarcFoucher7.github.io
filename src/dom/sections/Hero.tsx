import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../../animation/lenis';
import { links } from '../../content/profile';
import { useFitText } from '../../hooks/useFitText';
import { useT } from '../../i18n';
import { useApp } from '../../store/app';
import { GrooveButton } from '../ui/GrooveButton';
import { KeyPad } from '../ui/KeyPad';

const NAME = ['Marc', 'Foucher'];

/** Hero : le studio, la batterie jouable, et le nom en affiche de concert. */
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
        .to('.hero__char', { yPercent: 0, duration: 1.3, stagger: 0.04 }, 0.15)
        .to('.hero__fade', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 }, 0.45);
      gsap.to('.hero__bottom', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    { scope: ref, dependencies: [loaded] },
  );

  return (
    <section id="hero" className="hero" ref={ref} tabIndex={-1} aria-labelledby="hero-title">
      <div className="hero__top" data-ui>
        <p className="hero__kicker hero__fade">{t.hero.kicker}</p>
        <p className="hero__intro hero__fade">{t.hero.intro}</p>
        <div className="hero__play hero__fade">
          <p className="label">{t.hero.play}</p>
          <KeyPad />
          <div className="hero__play-row">
            <GrooveButton className="groove--pill" compact />
            <span className="label">{t.hero.hint}</span>
          </div>
        </div>
      </div>
      <div className="hero__bottom">
        <div className="hero__meta">
          <span className="hero__fade hero__scroll">({t.hero.scroll})</span>
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
