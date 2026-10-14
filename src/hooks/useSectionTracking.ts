import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SECTION_IDS, useApp } from '../store/app';
import { scrollState } from '../store/scroll';

/**
 * Publie la section visible dans le store et suit le pointeur.
 * Monté dans <App>, donc après les ScrollTrigger épinglés des sections (ordre correct).
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
          if (!self.isActive) return;
          setSection(id);
          // Le voile de lisibilité (CSS) dépend de la section affichée.
          document.documentElement.dataset.section = id;
        },
      }),
    );

    const onPointer = (event: PointerEvent): void => {
      scrollState.x = event.clientX;
      scrollState.y = event.clientY;
      scrollState.nx = (event.clientX / window.innerWidth) * 2 - 1;
      scrollState.ny = -((event.clientY / window.innerHeight) * 2 - 1);
      scrollState.movedAt = performance.now();
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    const refresh = (): void => ScrollTrigger.refresh();
    void document.fonts.ready.then(refresh);

    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);
}
