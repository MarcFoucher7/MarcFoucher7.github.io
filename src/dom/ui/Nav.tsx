import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import { scrollToTarget } from '../../animation/lenis';
import { links } from '../../content/profile';
import { useT } from '../../i18n';
import { useApp, type SectionId } from '../../store/app';
import { LangToggle, ThemeToggle } from './Toggles';

const NAV_ITEMS: {
  id: Exclude<SectionId, 'hero' | 'beyond'>;
  key: 'stage' | 'projects' | 'skills' | 'background' | 'contact';
}[] = [
  { id: 'stage', key: 'stage' },
  { id: 'projects', key: 'projects' },
  { id: 'skills', key: 'skills' },
  { id: 'background', key: 'background' },
  { id: 'contact', key: 'contact' },
];

/** Barre de navigation fixe ; le petit carré orange suit la section active comme un paquet. */
export function Nav() {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const section = useApp((s) => s.section);
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const packetRef = useRef<HTMLLIElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const active = section === 'beyond' ? 'background' : section;

  useLayoutEffect(() => {
    const place = (): void => {
      const list = listRef.current;
      const packet = packetRef.current;
      if (!list || !packet) return;
      const link = list.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
      if (!link) {
        packet.style.opacity = '0';
        return;
      }
      const x = link.offsetLeft + link.offsetWidth / 2 - packet.offsetWidth / 2;
      packet.style.opacity = '1';
      packet.style.transform = `translateX(${x}px)`;
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [active, lang]);

  useEffect(() => {
    if (sheetRef.current) sheetRef.current.inert = !open;
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (event: MouseEvent<HTMLAnchorElement>, id: string): void => {
    event.preventDefault();
    setOpen(false);
    scrollToTarget(`#${id}`);
  };

  const cv = lang === 'fr' ? links.cvFr : links.cvEn;

  return (
    <>
      <header className="nav">
        <nav className="nav__inner" aria-label={t.nav.label}>
          <a className="nav__brand" href="#hero" onClick={(e) => go(e, 'hero')}>
            Marc Foucher
          </a>
          <ul className="nav__links" ref={listRef}>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                  onClick={(e) => go(e, item.id)}
                >
                  {t.nav[item.key]}
                </a>
              </li>
            ))}
            <li className="nav__packet" ref={packetRef} aria-hidden="true" />
          </ul>
          <div className="nav__tools">
            <LangToggle />
            <ThemeToggle />
            <a
              className="icon-btn icon-btn--accent nav__desktop-only"
              href={cv}
              target="_blank"
              rel="noopener"
            >
              {t.nav.cv}
            </a>
            <button
              type="button"
              className="icon-btn nav__menu-btn"
              aria-expanded={open}
              aria-controls="nav-sheet"
              onClick={() => setOpen((o) => !o)}
            >
              {t.nav.menu}
            </button>
          </div>
        </nav>
      </header>
      <div className="nav__sheet" id="nav-sheet" data-open={open} ref={sheetRef}>
        {NAV_ITEMS.map((item) => (
          <a key={item.id} href={`#${item.id}`} onClick={(e) => go(e, item.id)}>
            {t.nav[item.key]}
          </a>
        ))}
        <a href="/dossier/">{t.nav.dossier}</a>
        <div className="nav__sheet-tools">
          <a className="btn btn--primary" href={cv} target="_blank" rel="noopener">
            {t.hero.cv}
          </a>
        </div>
      </div>
    </>
  );
}
