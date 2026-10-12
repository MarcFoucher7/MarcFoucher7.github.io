import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../../animation/lenis';
import { scrollState } from '../../store/scroll';

interface MarqueeProps {
  items: string[];
  reverse?: boolean;
  outline?: boolean;
}

/** Bandeau défilant infini ; sa vitesse et son sens suivent le scroll. Décoratif (aria-hidden). */
export function Marquee({ items, reverse = false, outline = false }: MarqueeProps) {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!track.current || prefersReducedMotion()) return;
      const tween = gsap.to(track.current, {
        xPercent: -50,
        duration: 38,
        ease: 'none',
        repeat: -1,
      });
      if (reverse) tween.progress(1);
      let direction = reverse ? -1 : 1;
      const tick = (): void => {
        const v = scrollState.velocity;
        if (Math.abs(v) > 0.5) direction = (v > 0 ? 1 : -1) * (reverse ? -1 : 1);
        const speed = direction * (1 + Math.min(Math.abs(v) * 0.12, 5));
        tween.timeScale(gsap.utils.interpolate(tween.timeScale(), speed, 0.1));
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { dependencies: [items.join('|')] },
  );

  const row = (key: string) => (
    <div className="marquee__group" key={key}>
      {items.map((item) => (
        <span className="marquee__item" key={item}>
          {item}
          <span className="marquee__sep" />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee${outline ? ' marquee--outline' : ''}`} aria-hidden="true">
      <div className="marquee__track" ref={track}>
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
