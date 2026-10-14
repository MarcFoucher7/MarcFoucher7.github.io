import { useEffect } from 'react';
import { hit } from '../audio/hits';
import { KEYMAP } from '../kit/ids';
import { useApp } from '../store/app';

/** Joue la batterie au clavier (sauf dans un champ de saisie ou avec un modificateur). */
export function useDrumKeys(): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const mapped = KEYMAP[e.code];
      if (!mapped || useApp.getState().menuOpen) return;
      hit(
        mapped.piece,
        0.9 + Math.random() * 0.1,
        e.shiftKey && mapped.piece === 'hihat' ? 'open' : mapped.variant,
      );
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
