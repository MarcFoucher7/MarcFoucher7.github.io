import { useRef } from 'react';
import { links } from '../../content/profile';
import { useClock } from '../../hooks/useClock';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useFitText } from '../../hooks/useFitText';
import { useReveal } from '../../hooks/useReveal';
import { useT } from '../../i18n';

/** Contact : titre géant, bouton rond magnétique, liens directs. */
export function Contact() {
  const t = useT();
  const clock = useClock();
  const circle = useRef<HTMLAnchorElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useMagnetic(circle, 0.4);
  useFitText(title);
  useReveal(title);

  return (
    <section id="contact" className="contact" tabIndex={-1} aria-labelledby="contact-title">
      <p className="label">{t.contact.kicker}</p>
      <h2 className="contact__title" id="contact-title" ref={title}>
        {t.contact.title.map((line) => (
          <span className="contact__line" key={line}>
            {line}
          </span>
        ))}
      </h2>
      <div className="contact__row">
        <a
          className="contact__circle"
          href={`mailto:${links.email}`}
          ref={circle}
          data-cursor="Mail"
        >
          <span>{t.contact.write}</span>
        </a>
        <a className="contact__mail" href={`mailto:${links.email}`}>
          {links.email}
        </a>
      </div>
      <ul className="contact__grid">
        <li>
          <a
            className="pill"
            href={links.cvFr}
            target="_blank"
            rel="noopener"
            hrefLang="fr"
            data-cursor="PDF"
          >
            {t.contact.cvFr}
          </a>
        </li>
        <li>
          <a
            className="pill"
            href={links.cvEn}
            target="_blank"
            rel="noopener"
            hrefLang="en"
            data-cursor="PDF"
          >
            {t.contact.cvEn}
          </a>
        </li>
        <li>
          <a className="pill" href={links.github} target="_blank" rel="noopener">
            GitHub
          </a>
        </li>
        <li>
          <a className="pill" href={links.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
        </li>
        <li className="contact__time">
          <span className="label">{t.contact.localTime}</span> Laval <time>{clock}</time>
        </li>
      </ul>
    </section>
  );
}
