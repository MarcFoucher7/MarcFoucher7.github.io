import { type MouseEvent } from 'react';
import { scrollToTarget } from '../../animation/lenis';
import { useClock } from '../../hooks/useClock';
import { useT } from '../../i18n';
import { useApp } from '../../store/app';
import { GrooveButton } from './GrooveButton';
import { LangToggle, SoundToggle } from './Toggles';
import { VuMeter } from './VuMeter';

/** En-tête fixe : logo, horloge du studio, groove/métronome, son, langue, menu. */
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
    <header className="hdr" data-menu={menuOpen}>
      <a className="hdr__logo" href="#hero" onClick={home}>
        MF<span className="visually-hidden">, {t.header.home}</span>
      </a>
      <p className="hdr__clock">
        <span className="hdr__rec" aria-hidden="true" />
        {t.header.place} <time>{clock}</time>
      </p>
      <GrooveButton className="hdr__groove" />
      <div className="hdr__actions">
        <SoundToggle className="hdr__btn hdr__sound">
          <VuMeter />
        </SoundToggle>
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
