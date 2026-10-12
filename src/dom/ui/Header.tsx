import { type MouseEvent } from 'react';
import { scrollToTarget } from '../../animation/lenis';
import { useClock } from '../../hooks/useClock';
import { useT } from '../../i18n';
import { useApp } from '../../store/app';
import { LangToggle } from './Toggles';

/** En-tête fixe en mix-blend « difference » : lisible sur la scène comme sur le texte. */
export function Header() {
  const t = useT();
  const clock = useClock();
  const menuOpen = useApp((s) => s.menuOpen);
  const setMenuOpen = useApp((s) => s.setMenuOpen);

  const home = (event: MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    setMenuOpen(false);
    scrollToTarget('#hero');
  };

  return (
    <header className="hdr">
      <a className="hdr__logo" href="#hero" onClick={home}>
        MF<span className="visually-hidden">, {t.header.home}</span>
      </a>
      <p className="hdr__clock">
        {t.header.place} <time>{clock}</time>
      </p>
      <p className="hdr__status">
        <span className="hdr__dot" aria-hidden="true" />
        {t.header.available}
      </p>
      <div className="hdr__actions">
        <LangToggle className="hdr__btn" />
        <button
          type="button"
          className="hdr__btn hdr__menu"
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="roll">
            <span className="roll__inner">{menuOpen ? t.header.close : t.header.menu}</span>
          </span>
        </button>
      </div>
    </header>
  );
}
