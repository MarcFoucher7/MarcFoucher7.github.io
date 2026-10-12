import { scrollToTarget } from '../../animation/lenis';
import { useT } from '../../i18n';

/** Pied de page. */
export function Footer() {
  const t = useT();
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span>© {new Date().getFullYear()} Marc Foucher</span>
        <a className="text-link" href="/dossier/">
          {t.footer.dossier}
        </a>
        <a
          className="text-link"
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget('#hero');
          }}
        >
          {t.footer.top}
        </a>
      </div>
    </footer>
  );
}
