import { beyond } from '../../content/profile';
import { useL, useT } from '../../i18n';

/** Expériences et passions hors informatique. */
export function Beyond() {
  const t = useT();
  const l = useL();
  return (
    <section id="beyond" className="section" tabIndex={-1} aria-labelledby="beyond-title">
      <div className="section__inner">
        <div className="column">
          <h2 className="section__title" id="beyond-title">
            {t.beyond.title}
          </h2>
          <ul className="beyond">
            {beyond.map((entry) => (
              <li key={entry.title.fr}>
                <span className="beyond__title">{l(entry.title)}</span>
                {entry.duration ? (
                  <span className="beyond__duration">{l(entry.duration)}</span>
                ) : (
                  <span />
                )}
                {entry.detail ? <p className="beyond__detail">{l(entry.detail)}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
