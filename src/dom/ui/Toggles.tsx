import { useT } from '../../i18n';
import { useApp } from '../../store/app';

/** Bascule FR / EN. */
export function LangToggle() {
  const t = useT();
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  const next = lang === 'fr' ? 'en' : 'fr';
  return (
    <button type="button" className="icon-btn" onClick={() => setLang(next)} lang={next}>
      {next.toUpperCase()}
      <span className="visually-hidden">, {t.toggles.langLabel}</span>
    </button>
  );
}

/** Bascule thème clair / sombre. */
export function ThemeToggle() {
  const t = useT();
  const theme = useApp((s) => s.theme);
  const toggleTheme = useApp((s) => s.toggleTheme);
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggleTheme}
      aria-label={isDark ? t.toggles.themeToLight : t.toggles.themeToDark}
      title={isDark ? t.toggles.light : t.toggles.dark}
    >
      {isDark ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  );
}
