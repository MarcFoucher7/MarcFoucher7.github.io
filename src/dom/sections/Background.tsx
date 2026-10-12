import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../../animation/lenis';
import { certifications, timeline } from '../../content/profile';
import { useFitText } from '../../hooks/useFitText';
import { useReveal } from '../../hooks/useReveal';
import { useL, useT } from '../../i18n';

/** Parcours : titre collant à gauche, frise dont la ligne se trace au scroll. */
export function Background() {
  const t = useT();
  const l = useL();
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useFitText(title, { max: 150 });
  useReveal(title);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        '.tl__line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 60%', scrub: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      id="background"
      className="bg"
      ref={root}
      tabIndex={-1}
      aria-labelledby="background-title"
    >
      <div className="bg__aside">
        <h2 className="sec-head__title" id="background-title" ref={title}>
          {t.background.title}
        </h2>
      </div>
      <div className="bg__main">
        <div className="tl">
          <span className="tl__line" aria-hidden="true" />
          <ol className="tl__list">
            {timeline.map((entry) => (
              <li
                className="tl__item"
                key={entry.title.fr}
                data-upcoming={entry.upcoming ? 'true' : undefined}
              >
                <p className="label tl__when">{l(entry.when)}</p>
                <h3 className="tl__title">{l(entry.title)}</h3>
                <p className="tl__detail">{l(entry.detail)}</p>
              </li>
            ))}
          </ol>
        </div>
        <h3 className="label bg__certs-title">{t.background.certifications}</h3>
        <ul className="bg__certs">
          {certifications.map((cert) => (
            <li key={cert.fr}>{l(cert)}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
