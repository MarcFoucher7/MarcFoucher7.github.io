import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../../animation/lenis';

/** Curseur personnalisé (point + anneau) sur les appareils à pointeur fin uniquement. */
export function Cursor() {
  const [enabled] = useState(
    () =>
      window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion(),
  );
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    document.documentElement.classList.add('has-cursor');
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' });

    const move = (e: PointerEvent): void => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      ring.current?.classList.add('is-visible');
      dot.current?.classList.add('is-visible');
    };
    const over = (e: PointerEvent): void => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]');
      ring.current?.classList.toggle('is-hover', Boolean(target));
      const text = target?.dataset.cursor ?? '';
      ring.current?.classList.toggle('has-label', Boolean(text));
      if (label.current) label.current.textContent = text;
    };
    const leave = (): void => {
      ring.current?.classList.remove('is-visible');
      dot.current?.classList.remove('is-visible');
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__ring" ref={ring}>
        <div className="cursor__circle">
          <span className="cursor__label" ref={label} />
        </div>
      </div>
      <div className="cursor__dot" ref={dot} />
    </div>
  );
}
