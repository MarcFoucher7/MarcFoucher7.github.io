/** Accès localStorage/sessionStorage tolérant aux erreurs (navigation privée, stockage bloqué). */
export function readStorage(store: 'local' | 'session', key: string): string | null {
  try {
    return (store === 'local' ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

/** Écrit une valeur sans jamais lever d'exception. */
export function writeStorage(store: 'local' | 'session', key: string, value: string): void {
  try {
    (store === 'local' ? window.localStorage : window.sessionStorage).setItem(key, value);
  } catch {
    /* stockage indisponible : on ignore */
  }
}
