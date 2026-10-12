import { skills } from '../../content/profile';
import { useL, useT } from '../../i18n';

/** Compétences regroupées par domaine. */
export function Skills() {
  const t = useT();
  const l = useL();
  return (
    <section id="skills" className="section" tabIndex={-1} aria-labelledby="skills-title">
      <div className="section__inner">
        <div className="column">
          <h2 className="section__title" id="skills-title">
            {t.skills.title}
          </h2>
          <dl>
            {skills.map((group) => (
              <div className="skills__row" key={group.title.fr}>
                <dt>{l(group.title)}</dt>
                <dd>
                  {group.items.map((item) => (
                    <span className="chip" key={item.fr}>
                      {l(item)}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
