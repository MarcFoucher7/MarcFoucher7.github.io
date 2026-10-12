import { useEffect, useRef, type MouseEvent } from 'react';
import { lockScroll, scrollToTarget } from '../../animation/lenis';
import { links } from '../../content/profile';
import { useT } from '../../i18n';
import { useApp } from '../../store/app';
import { LangToggle, ThemeToggle } from './Toggles';

const ITEMS = ['stage', 'projects', 'skills', 'background', 'contact'] as const;

/** Menu plein écran : grands liens, réglages et contacts. */
export function Menu() {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const open = useApp((s) => s.menuOpen);
  const setOpen = useApp((s) => s.setMenuOpen);
  const ref = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (ref.current) ref.current.inert = !open;
    // Ne relâche le scroll que si c'est le menu qui l'avait bloqué (le preloader le bloque aussi).
    if (open || wasOpen.current) lockScroll(open);
    wasOpen.current = open;
    if (!open) return;
    ref.current?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  const go = (event: MouseEvent<HTMLAnchorElement>, id: string): void => {
    event.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToTarget(`#${id}`), 350);
  };

  return (
    <div className="menu" id="menu" ref={ref} data-open={open}>
      <nav aria-label={t.menu.label}>
        <ul className="menu__links">
          {ITEMS.map((id, i) => (
            <li key={id} style={{ ['--i' as string]: i }}>
              <a href={`#${id}`} onClick={(e) => go(e, id)}>
                <span>{t.menu.links[id]}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="menu__foot">
        <div className="menu__group">
          <ThemeToggle className="menu__small" />
          <LangToggle className="menu__small" />
        </div>
        <div className="menu__group">
          <a
            className="menu__small"
            href={lang === 'fr' ? links.cvFr : links.cvEn}
            target="_blank"
            rel="noopener"
          >
            {t.menu.cv}
          </a>
          <a className="menu__small" href="/dossier/">
            {t.menu.dossier}
          </a>
        </div>
        <div className="menu__group">
          <a className="menu__small" href={`mailto:${links.email}`}>
            {links.email}
          </a>
          <a className="menu__small" href={links.github} target="_blank" rel="noopener">
            GitHub
          </a>
          <a className="menu__small" href={links.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
