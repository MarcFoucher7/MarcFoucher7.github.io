import { useRef } from 'react';
import { beyond } from '../../content/profile';
import { useFitText } from '../../hooks/useFitText';
import { useReveal } from '../../hooks/useReveal';
import { useL, useT } from '../../i18n';

/** Hors informatique : marchés, batterie, handball. */
export function Beyond() {
  const t = useT();
  const l = useL();
  const title = useRef<HTMLHeadingElement>(null);
  useFitText(title, { max: 110 });
  useReveal(title);
  return (
    <section id="beyond" className="beyond" tabIndex={-1} aria-labelledby="beyond-title">
      <header className="sec-head" data-ui>
        <p className="label">{t.beyond.label}</p>
        <h2 className="sec-head__title sec-head__title--small" id="beyond-title" ref={title}>
          {t.beyond.title}
        </h2>
      </header>
      <ul className="beyond__list" data-ui>
        {beyond.map((entry) => (
          <li className="beyond__item" key={entry.title.fr}>
            <h3 className="beyond__title">{l(entry.title)}</h3>
            {entry.duration ? <p className="label">{l(entry.duration)}</p> : null}
            {entry.detail ? <p className="beyond__detail">{l(entry.detail)}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
