import { useRef } from 'react';
import { timeline } from '../../content/profile';
import { useFitText } from '../../hooks/useFitText';
import { useReveal } from '../../hooks/useReveal';
import { useL, useT } from '../../i18n';

/** Parcours présenté comme une setlist de concert (la caméra passe au-dessus de la batterie). */
export function Background() {
  const t = useT();
  const l = useL();
  const title = useRef<HTMLHeadingElement>(null);
  useFitText(title, { max: 190 });
  useReveal(title);

  return (
    <section id="background" className="setlist" tabIndex={-1} aria-labelledby="background-title">
      <div className="setlist__inner" data-ui>
        <p className="label">{t.background.label}</p>
        <h2 className="sec-head__title" id="background-title" ref={title}>
          {t.background.title}
        </h2>
        <ol className="setlist__list">
          {timeline.map((entry, i) => (
            <li
              className="setlist__item"
              key={entry.title.fr}
              data-upcoming={entry.upcoming ? 'true' : undefined}
            >
              <span className="setlist__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="setlist__body">
                <h3 className="setlist__title">{l(entry.title)}</h3>
                <p className="setlist__when label">{l(entry.when)}</p>
                <p className="setlist__detail">{l(entry.detail)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
