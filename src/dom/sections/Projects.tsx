import { projects } from '../../content/profile';
import { useL, useT } from '../../i18n';

/** Projets académiques et personnels. */
export function Projects() {
  const t = useT();
  const l = useL();
  return (
    <section id="projects" className="section" tabIndex={-1} aria-labelledby="projects-title">
      <div className="section__inner">
        <div className="column">
          <h2 className="section__title" id="projects-title">
            {t.projects.title}
          </h2>
          <p className="section__lead">{t.projects.intro}</p>
          <ul className="projects">
            {projects.map((project) => (
              <li className="project" key={project.image}>
                <div className="project__media">
                  <img
                    src={project.image}
                    alt={l(project.alt)}
                    loading="lazy"
                    decoding="async"
                    width="1000"
                    height="625"
                  />
                </div>
                <div>
                  <h3>{l(project.title)}</h3>
                  <p className="project__tech">{project.tech}</p>
                  <p className="project__desc">{l(project.description)}</p>
                  {project.repo ? (
                    <a
                      className="text-link project__repo"
                      href={project.repo}
                      target="_blank"
                      rel="noopener"
                    >
                      GitHub
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
