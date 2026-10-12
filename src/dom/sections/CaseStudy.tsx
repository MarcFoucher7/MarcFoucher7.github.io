import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { internship } from '../../content/internship';
import { links } from '../../content/profile';
import { useReveal } from '../../hooks/useReveal';
import { useL, useT } from '../../i18n';
import { STAGE_STEPS, useApp } from '../../store/app';
import type { Localized } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

interface Step {
  title: Localized;
  body: Localized[];
}

/**
 * Étude de cas ALL4TEC : section épinglée sur grand écran.
 * Chaque étape fait rouler le D20 de particules vers une nouvelle face.
 */
export function CaseStudy() {
  const t = useT();
  const l = useL();
  const step = useApp((s) => s.stageStep);
  const setStep = useApp((s) => s.setStageStep);
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useReveal(title);

  const steps: Step[] = [
    { title: { fr: t.stage.problem, en: t.stage.problem }, body: [internship.problem] },
    ...internship.missions.map((m) => ({ title: m.title, body: m.points })),
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        ScrollTrigger.create({
          trigger: pin.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * (STAGE_STEPS - 0.2)}`,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            setStep(Math.min(STAGE_STEPS - 1, Math.floor(self.progress * STAGE_STEPS)));
            pin.current?.style.setProperty('--case-progress', self.progress.toFixed(4));
          },
        });
      });
      mm.add('(max-width: 899px)', () => {
        const items = gsap.utils.toArray<HTMLElement>('.case__step');
        items.forEach((item, i) =>
          ScrollTrigger.create({
            trigger: item,
            start: 'top 60%',
            end: 'bottom 60%',
            onToggle: (self) => {
              if (self.isActive) setStep(i);
            },
          }),
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const current = String(step + 1).padStart(2, '0');
  const total = String(STAGE_STEPS).padStart(2, '0');

  return (
    <section id="stage" className="case" ref={root} tabIndex={-1} aria-labelledby="case-title">
      <header className="case__head">
        <p className="label">{t.stage.label}</p>
        <h2 className="case__title" id="case-title" ref={title}>
          {t.stage.title}
        </h2>
        <dl className="case__meta">
          <div>
            <dt className="label">{t.stage.companyLabel}</dt>
            <dd>{l(internship.company)}</dd>
          </div>
          <div>
            <dt className="label">{t.stage.periodLabel}</dt>
            <dd>{t.stage.period}</dd>
          </div>
          <div>
            <dt className="label">{t.stage.roleLabel}</dt>
            <dd>{t.stage.role}</dd>
          </div>
          <div>
            <dt className="label">{t.stage.stackLabel}</dt>
            <dd>{internship.stack.join(', ')}</dd>
          </div>
        </dl>
      </header>

      <div className="case__pin" ref={pin}>
        <div className="case__panel">
          <p className="case__counter" aria-hidden="true">
            <span className="case__counter-current">{current}</span>
            <span className="case__counter-total">/{total}</span>
          </p>
          <div className="case__bar" aria-hidden="true">
            <span />
          </div>
          <ol className="case__steps">
            {steps.map((s, i) => (
              <li
                className="case__step"
                key={s.title.fr}
                data-active={i === step}
                aria-current={i === step ? 'step' : undefined}
              >
                <h3 className="case__step-title">{l(s.title)}</h3>
                {s.body.length === 1 ? (
                  <p className="case__step-lead">{l(s.body[0] as Localized)}</p>
                ) : (
                  <ul className="case__step-list">
                    {s.body.map((point) => (
                      <li key={point.fr}>{l(point)}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
          <p className="case__hint">{t.stage.hint}</p>
        </div>
      </div>

      <div className="case__outro">
        <p className="label">{t.stage.result}</p>
        <p className="case__result">{l(internship.result)}</p>
        <div className="case__actions">
          <a
            className="pill pill--accent"
            href={internship.demoUrl}
            target="_blank"
            rel="noopener"
            data-cursor="Demo"
          >
            {t.stage.demo}
            <span className="visually-hidden"> {t.newTab}</span>
          </a>
          <a className="pill" href={links.letter} target="_blank" rel="noopener" data-cursor="PDF">
            {t.stage.letter}
          </a>
          <a className="text-link" href={links.report} target="_blank" rel="noopener">
            {t.stage.report}
          </a>
        </div>
        <p className="case__cert">
          <span className="label">{t.stage.certification}</span> {l(internship.certification)}
        </p>
      </div>
    </section>
  );
}
