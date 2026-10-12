import { useEffect } from 'react';
import { initLenis } from './animation/lenis';
import { useSectionTracking } from './animation/useSectionTracking';
import { useT } from './i18n';
import { useApp } from './store/app';
import { Nav } from './dom/ui/Nav';
import { Hero } from './dom/sections/Hero';
import { Internship } from './dom/sections/Internship';
import { Projects } from './dom/sections/Projects';
import { Skills } from './dom/sections/Skills';
import { Background } from './dom/sections/Background';
import { Beyond } from './dom/sections/Beyond';
import { Contact } from './dom/sections/Contact';
import { Footer } from './dom/sections/Footer';
import { SceneHost } from './canvas/SceneHost';

/** Racine : DOM complet (contenu, accessibilité) + scène 3D chargée en différé derrière. */
export function App() {
  const t = useT();
  const lang = useApp((s) => s.lang);

  useEffect(() => initLenis(), []);
  useSectionTracking();

  useEffect(() => {
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
  }, [lang, t]);

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <SceneHost />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Internship />
        <Projects />
        <Skills />
        <Background />
        <Beyond />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
