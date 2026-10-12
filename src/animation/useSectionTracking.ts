import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SECTION_IDS, useApp } from '../store/app';
import { scrollState } from '../store/scroll';

/**
 * Publie la section visible dans le store et la progression du hero dans scrollState.
 * À monter une seule fois, après le rendu des sections.
 */
export function useSectionTracking(): void {
  useEffect(() => {
    const setSection = useApp.getState().setSection;
    const triggers = SECTION_IDS.map((id) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (self.isActive) setSection(id);
        },
      }),
    );
    triggers.push(
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          scrollState.hero = self.progress;
          document.documentElement.style.setProperty('--hero-progress', self.progress.toFixed(3));
        },
      }),
    );

    const onPointer = (event: PointerEvent): void => {
      scrollState.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);
}
