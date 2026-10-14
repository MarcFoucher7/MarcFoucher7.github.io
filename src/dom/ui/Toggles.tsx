import { useT } from '../../i18n';
import { useApp } from '../../store/app';

/** Bascule FR / EN : affiche la langue cible. */
export function LangToggle({ className = '' }: { className?: string }) {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  const next = lang === 'fr' ? 'en' : 'fr';
  return (
    <button type="button" className={className} onClick={() => setLang(next)} lang={next}>
      {next.toUpperCase()}
      <span className="visually-hidden">, {t.toggles.langLabel}</span>
    </button>
  );
}

/** Bascule session de nuit / de jour (thème sombre / clair et éclairage du studio). */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const t = useT();
  const theme = useApp((s) => s.theme);
  const toggleTheme = useApp((s) => s.toggleTheme);
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      className={className}
      onClick={toggleTheme}
      aria-label={dark ? t.toggles.themeToLight : t.toggles.themeToDark}
    >
      <span aria-hidden="true">
        {t.menu.theme} : {dark ? t.menu.themeDark : t.menu.themeLight}
      </span>
    </button>
  );
}

/** Coupe ou rétablit le son. */
export function SoundToggle({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const t = useT();
  const muted = useApp((s) => s.muted);
  const setMuted = useApp((s) => s.setMuted);
  return (
    <button
      type="button"
      className={className}
      aria-pressed={!muted}
      aria-label={muted ? t.header.soundOff : t.header.soundOn}
      onClick={() => setMuted(!muted)}
      data-muted={muted}
    >
      {children}
      <span aria-hidden="true">{t.header.sound}</span>
    </button>
  );
}
