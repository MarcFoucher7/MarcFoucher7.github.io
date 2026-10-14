import { useEffect, useRef } from 'react';
import { BPM, onBeat, startGroove, stopGroove } from '../../audio/groove';
import { useT } from '../../i18n';
import { useApp } from '../../store/app';

/** Lance ou arrête le groove ; le point pulse sur chaque temps du métronome. */
export function GrooveButton({
  className = '',
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const t = useT();
  const grooving = useApp((s) => s.grooving);
  const setGrooving = useApp((s) => s.setGrooving);
  const dot = useRef<HTMLSpanElement>(null);

  useEffect(
    () =>
      onBeat((beat) => {
        const el = dot.current;
        if (!el) return;
        el.dataset.beat = beat === 0 ? 'one' : 'on';
        el.getAnimations().forEach((a) => a.cancel());
        el.animate(
          [
            { transform: 'scale(1.9)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0.55 },
          ],
          {
            duration: 260,
            easing: 'ease-out',
          },
        );
      }),
    [],
  );

  const toggle = (): void => {
    if (grooving) {
      stopGroove();
      setGrooving(false);
    } else if (startGroove()) {
      setGrooving(true);
    }
  };

  return (
    <button
      type="button"
      className={`groove ${className}`}
      aria-pressed={grooving}
      onClick={toggle}
      data-playing={grooving}
    >
      <span className="groove__dot" ref={dot} aria-hidden="true" />
      <span className="groove__label">{grooving ? t.header.grooveStop : t.header.groovePlay}</span>
      {compact ? null : (
        <span className="groove__bpm" aria-hidden="true">
          {BPM} BPM
        </span>
      )}
    </button>
  );
}
