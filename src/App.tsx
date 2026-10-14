import { useEffect } from 'react';
import { initLenis } from './animation/lenis';
import { useAudioSync } from './hooks/useAudioSync';
import { useDrumKeys } from './hooks/useDrumKeys';
import { useSectionTracking } from './hooks/useSectionTracking';
import { useT } from './i18n';
import { useApp } from './store/app';
import { SceneHost } from './canvas/SceneHost';
import { Preloader } from './dom/ui/Preloader';
import { Header } from './dom/ui/Header';
import { Menu } from './dom/ui/Menu';
import { Cursor } from './dom/ui/Cursor';
import { Hero } from './dom/sections/Hero';
import { Manifesto } from './dom/sections/Manifesto';
import { KitSection } from './dom/sections/KitSection';
import { CaseStudy } from './dom/sections/CaseStudy';
import { Projects } from './dom/sections/Projects';
import { Background } from './dom/sections/Background';
import { Beyond } from './dom/sections/Beyond';
import { Contact } from './dom/sections/Contact';
import { Footer } from './dom/sections/Footer';

/** Racine : le studio 3D en fond, le contenu accessible par-dessus. */
export function App() {
  const t = useT();
  const lang = useApp((s) => s.lang);

  useEffect(() => initLenis(), []);
  useSectionTracking();
  useDrumKeys();
  useAudioSync();

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
      <div className="scrim" aria-hidden="true" />
      <Preloader />
      <Header />
      <Menu />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Manifesto />
        <KitSection />
        <CaseStudy />
        <Projects />
        <Background />
        <Beyond />
        <Contact />
      </main>
      <Footer />
      <Cursor />
    </>
  );
}
