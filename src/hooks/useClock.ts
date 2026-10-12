import { useEffect, useState } from 'react';

const format = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  hour: '2-digit',
  minute: '2-digit',
});

/** Heure de Laval (Europe/Paris), mise à jour chaque minute. */
export function useClock(): string {
  const [now, setNow] = useState(() => format.format(new Date()));
  useEffect(() => {
    const id = window.setInterval(() => setNow(format.format(new Date())), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}
