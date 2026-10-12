import { internship } from '../../content/internship';
import { links } from '../../content/profile';
import { useL, useT } from '../../i18n';

/** Étude de cas du stage ALL4TEC : la pièce maîtresse du portfolio. */
export function Internship() {
  const t = useT();
  const l = useL();
  return (
    <section id="stage" className="section" tabIndex={-1} aria-labelledby="stage-title">
      <div className="section__inner">
        <div className="column">
          <h2 className="section__title" id="stage-title">
            {t.stage.title}
          </h2>
          <p className="stage__subtitle">{t.stage.subtitle}</p>
          <p className="stage__period">{t.stage.period}</p>

          <dl className="facts">
            <div>
              <dt>{t.stage.company}</dt>
              <dd>{l(internship.company)}</dd>
            </div>
            <div>
              <dt>{t.stage.role}</dt>
              <dd>{l(internship.role)}</dd>
            </div>
            <div>
              <dt>{t.stage.stack}</dt>
              <dd>{internship.stack.join(', ')}</dd>
            </div>
          </dl>

          <div className="stage__block">
            <h3 className="stage__h3">{t.stage.problem}</h3>
            <p className="stage__problem">{l(internship.problem)}</p>
          </div>

          <div className="stage__block">
            <h3 className="stage__h3">{t.stage.built}</h3>
            <div className="missions">
              {internship.missions.map((mission) => (
                <div className="mission" key={mission.title.fr}>
                  <h4>{l(mission.title)}</h4>
                  <ul className="packet-list">
                    {mission.points.map((point) => (
                      <li key={point.fr}>{l(point)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="stage__block">
            <h3 className="stage__h3">{t.stage.result}</h3>
            <p className="stage__result">{l(internship.result)}</p>
            <div className="btn-row">
              <a
                className="btn btn--primary"
                href={internship.demoUrl}
                target="_blank"
                rel="noopener"
              >
                {t.stage.demo}
                <span className="visually-hidden"> {t.newTab}</span>
              </a>
              <a className="btn btn--ghost" href={links.letter} target="_blank" rel="noopener">
                {t.stage.letter}
              </a>
              <a className="text-link" href={links.report} target="_blank" rel="noopener">
                {t.stage.report}
              </a>
            </div>
            <p className="stage__cert">
              <strong>{t.stage.certification}.</strong> {l(internship.certification)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
