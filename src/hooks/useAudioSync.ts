import { useEffect } from 'react';
import { setMuted } from '../audio/engine';
import { stopGroove } from '../audio/groove';
import { useApp } from '../store/app';

/** Répercute le réglage « son coupé » sur le moteur audio et arrête le groove au démontage. */
export function useAudioSync(): void {
  useEffect(() => {
    setMuted(useApp.getState().muted);
    const unsub = useApp.subscribe((s, prev) => {
      if (s.muted !== prev.muted) setMuted(s.muted);
    });
    return () => {
      unsub();
      stopGroove();
    };
  }, []);
}
