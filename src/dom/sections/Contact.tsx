import { links } from '../../content/profile';
import { useT } from '../../i18n';

/** Appel à l'action final : mail, CV, réseaux. */
export function Contact() {
  const t = useT();
  return (
    <section id="contact" className="section contact" tabIndex={-1} aria-labelledby="contact-title">
      <div className="section__inner">
        <div className="column">
          <div className="contact__head">
            <img
              className="contact__photo"
              src="/images/profil.webp"
              alt="Marc Foucher"
              width="88"
              height="88"
              loading="lazy"
            />
            <h2 className="section__title" id="contact-title">
              {t.contact.title}
            </h2>
          </div>
          <p className="hero__lead">{t.contact.lead}</p>
          <a className="contact__mail text-link" href={`mailto:${links.email}`}>
            {links.email}
          </a>
          <div className="btn-row">
            <a
              className="btn btn--primary"
              href={links.cvFr}
              target="_blank"
              rel="noopener"
              hrefLang="fr"
            >
              {t.contact.cvFr}
            </a>
            <a
              className="btn btn--ghost"
              href={links.cvEn}
              target="_blank"
              rel="noopener"
              hrefLang="en"
            >
              {t.contact.cvEn}
            </a>
          </div>
          <div className="contact__links">
            <a className="text-link" href={links.github} target="_blank" rel="noopener">
              GitHub
            </a>
            <a className="text-link" href={links.linkedin} target="_blank" rel="noopener">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
