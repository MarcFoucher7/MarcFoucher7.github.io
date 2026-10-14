import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { bands } from '../../audio/engine';

const BARS = 5;

/** Petit VU-mètre lié à la vraie sortie audio (analyseur WebAudio). */
export function VuMeter() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const bars = Array.from(ref.current?.children ?? []) as HTMLElement[];
    const tick = (): void => {
      const values = bands(BARS);
      bars.forEach((bar, i) => {
        const v = Math.min(1, (values[i] ?? 0) * 1.6);
        bar.style.transform = `scaleY(${(0.18 + v * 0.82).toFixed(3)})`;
      });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  return (
    <span className="vu" ref={ref} aria-hidden="true">
      {Array.from({ length: BARS }, (_, i) => (
        <i key={i} />
      ))}
    </span>
  );
}
