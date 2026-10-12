import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { projects } from '../../content/profile';
import { useFitText } from '../../hooks/useFitText';
import { useReveal } from '../../hooks/useReveal';
import { useL, useT } from '../../i18n';

/** Liste de projets en grandes lignes ; l'aperçu suit le curseur au survol (desktop). */
export function Projects() {
  const t = useT();
  const l = useL();
  const [active, setActive] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useFitText(title, { reserve: 90 });
  useReveal(title);

  useEffect(() => {
    const el = preview.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' });
    const rTo = gsap.quickTo(el, 'rotation', { duration: 0.9, ease: 'power3' });
    let lastX = 0;
    const move = (e: PointerEvent): void => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <section id="projects" className="projects" tabIndex={-1} aria-labelledby="projects-title">
      <header className="sec-head">
        <h2 className="sec-head__title" id="projects-title" ref={title}>
          {t.projects.title}
        </h2>
        <span className="sec-head__count" aria-hidden="true">
          ({String(projects.length).padStart(2, '0')})
        </span>
      </header>
      <ul className="plist" onPointerLeave={() => setActive(null)}>
        {projects.map((project, i) => (
          <li
            className="prow"
            key={project.image}
            data-active={active === i}
            onPointerEnter={() => setActive(i)}
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
      <div className="ppreview" ref={preview} aria-hidden="true">
        <div className="ppreview__inner" data-visible={active !== null}>
          {projects.map((project, i) => (
            <img
              key={project.image}
              src={project.image}
              alt=""
              data-active={active === i}
              decoding="async"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
