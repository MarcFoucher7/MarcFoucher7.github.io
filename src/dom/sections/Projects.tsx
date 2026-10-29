import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { kitState } from '../../canvas/state';
import { projects } from '../../content/profile';
import { useFitText } from '../../hooks/useFitText';
import { useReveal } from '../../hooks/useReveal';
import { useL, useT } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

/** On garde l'index d'origine : l'écran du studio affiche `projects[index]`. */
const entries = projects.map((project, index) => ({ project, index }));
const featured = entries.filter((e) => e.project.featured);
const others = entries.filter((e) => !e.project.featured);

/** Affiche le projet sur l'écran du studio. */
const show = (index: number) => (): void => {
  kitState.activeProject = index;
};

/**
 * Projets : les projets mis en avant en grandes lignes, les autres en liste compacte.
 * Le projet survolé (ou celui au centre de l'écran) s'affiche sur l'écran du studio en 3D.
 */
export function Projects() {
  const t = useT();
  const l = useL();
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useFitText(title, { reserve: 90, max: 230 });
  useReveal(title);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-project]').forEach((el) => {
        const index = Number(el.dataset.project);
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) kitState.activeProject = index;
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="projects"
      className="projects"
      ref={root}
      tabIndex={-1}
      aria-labelledby="projects-title"
    >
      <header className="sec-head" data-ui>
        <h2 className="sec-head__title" id="projects-title" ref={title}>
          {t.projects.title}
        </h2>
        <span className="sec-head__count" aria-hidden="true">
          ({String(projects.length).padStart(2, '0')})
        </span>
      </header>
      <p className="projects__lead label" data-ui>
        {t.projects.lead}
      </p>
      <ul className="plist" data-ui>
        {featured.map(({ project, index }) => (
          <li
            className="prow"
            key={project.image}
            data-project={index}
            onPointerEnter={show(index)}
            onFocus={show(index)}
            tabIndex={0}
          >
            <h3 className="prow__title">{l(project.title)}</h3>
            <div className="prow__info">
              <p className="prow__tech">{project.tech}</p>
              <p className="prow__desc">{l(project.description)}</p>
              {project.repo ? (
                <a className="text-link" href={project.repo} target="_blank" rel="noopener">
                  GitHub
                </a>
              ) : null}
            </div>
            <img
              className="prow__img"
              src={project.image}
              alt={l(project.alt)}
              loading="lazy"
              decoding="async"
              width="1000"
              height="625"
            />
          </li>
        ))}
      </ul>
      {others.length > 0 ? (
        <div className="pmore" data-ui>
          <h3 className="pmore__title label">{t.projects.more}</h3>
          <ul className="pmore__list">
            {others.map(({ project, index }) => (
              <li
                className="pmini"
                key={project.image}
                data-project={index}
                onPointerEnter={show(index)}
                onFocus={show(index)}
                tabIndex={0}
              >
                <h4 className="pmini__title">{l(project.title)}</h4>
                <p className="prow__tech">{project.tech}</p>
                <p className="pmini__desc">{l(project.description)}</p>
                {project.repo ? (
                  <a className="text-link" href={project.repo} target="_blank" rel="noopener">
                    GitHub
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
