import { certifications, timeline } from '../../content/profile';
import { useL, useT } from '../../i18n';

/** Parcours chronologique et certifications. */
export function Background() {
  const t = useT();
  const l = useL();
  return (
    <section id="background" className="section" tabIndex={-1} aria-labelledby="background-title">
      <div className="section__inner">
        <div className="column">
          <h2 className="section__title" id="background-title">
            {t.background.title}
          </h2>
          <ol className="timeline">
            {timeline.map((entry) => (
              <li key={entry.title.fr} data-upcoming={entry.upcoming ? 'true' : undefined}>
                <p className="timeline__when">{l(entry.when)}</p>
                <h3 className="timeline__title">{l(entry.title)}</h3>
                <p className="timeline__detail">{l(entry.detail)}</p>
              </li>
            ))}
          </ol>
          <h3 className="subhead">{t.background.certifications}</h3>
          <ul className="packet-list">
            {certifications.map((cert) => (
              <li key={cert.fr}>{l(cert)}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
