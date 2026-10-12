import { useRef } from 'react';
import { skills } from '../../content/profile';
import { useFitText } from '../../hooks/useFitText';
import { useReveal } from '../../hooks/useReveal';
import { useL, useT } from '../../i18n';
import { Marquee } from '../ui/Marquee';

/** Compétences : deux bandeaux défilants (décoratifs) puis la liste structurée. */
export function Skills() {
  const t = useT();
  const l = useL();
  const title = useRef<HTMLHeadingElement>(null);
  useFitText(title);
  useReveal(title);

  const all = skills.flatMap((group) => group.items.map((item) => l(item)));
  const half = Math.ceil(all.length / 2);

  return (
    <section id="skills" className="skills" tabIndex={-1} aria-labelledby="skills-title">
      <header className="sec-head">
        <h2 className="sec-head__title" id="skills-title" ref={title}>
          {t.skills.title}
        </h2>
      </header>
      <div className="skills__marquees">
        <Marquee items={all.slice(0, half)} />
        <Marquee items={all.slice(half)} reverse outline />
      </div>
      <dl className="skills__grid">
        {skills.map((group) => (
          <div className="skills__group" key={group.title.fr}>
            <dt className="label">{l(group.title)}</dt>
            {group.items.map((item) => (
              <dd key={item.fr}>{l(item)}</dd>
            ))}
          </div>
        ))}
      </dl>
    </section>
  );
}
