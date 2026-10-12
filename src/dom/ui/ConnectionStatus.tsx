import { useT } from '../../i18n';
import { useApp } from '../../store/app';

/**
 * Ligne d'état du hero : sert de « loader » non bloquant pour la scène 3D.
 * Rejoue la reconnexion par token vécue en stage quand la page est rechargée (F5).
 */
export function ConnectionStatus() {
  const t = useT();
  const connection = useApp((s) => s.connection);
  const syncCount = useApp((s) => s.syncCount);
  const scene = useApp((s) => s.scene);

  if (scene === 'static') return null;

  const label =
    connection === 'connected'
      ? `${t.status.connected}${syncCount > 0 ? `, ${t.status.syncs(syncCount)}` : ''}`
      : connection === 'reconnecting'
        ? t.status.reconnecting
        : t.status.connecting;

  return (
    <p className="status" data-state={connection} aria-live="polite">
      <span className="status__dot" aria-hidden="true" />
      {label}
    </p>
  );
}
