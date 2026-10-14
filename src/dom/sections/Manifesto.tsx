import { useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../../animation/lenis';
import { useT } from '../../i18n';
import { useApp } from '../../store/app';

gsap.registerPlugin(SplitText);

/** Manifeste : les mots s'allument au scroll pendant que la caméra s'approche de la grosse caisse. */
export function Manifesto() {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const split = SplitText.create(el, {
        type: 'words',
        wordsClass: 'word',
        aria: 'none',
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.4 },
            {
              opacity: 1,
              ease: 'none',
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
            },
          ),
      });
      return () => split.revert();
    },
    { dependencies: [lang], revertOnUpdate: true },
  );

  return (
    <section id="intro" className="manifesto" tabIndex={-1} aria-label={t.hero.kicker}>
      <p className="manifesto__text" ref={ref} data-ui>
        {t.manifesto}
      </p>
    </section>
  );
}
