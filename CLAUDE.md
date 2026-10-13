# CLAUDE.md — Portfolio 3D de Marc Foucher

Refonte complète de `MarcFoucher7.github.io` : passer d'un site HTML/CSS statique à un portfolio 3D immersif, niveau agence / Awwwards.
**Objectif business : décrocher une alternance BUT3 (2026-2027) en développement fullstack.** Le site doit prouver la maîtrise technique en 3 secondes et donner accès au CV en 1 clic.

Priorités, dans l'ordre : **contenu lisible & accès CV > performance (60 fps, mobile) > direction artistique > storytelling au scroll > finitions**.

## Contraintes non négociables

- **Hébergement : GitHub Pages, site utilisateur** (`https://marcfoucher7.github.io/`, base `/`). Build Vite → déploiement via GitHub Actions (`actions/deploy-pages`), pas de commit du `dist/`.
- **Bilingue FR / EN** (existant) : toutes les chaînes dans `src/i18n/fr.ts` et `src/i18n/en.ts`, langue persistée, attribut `<html lang>` à jour. Aucun texte en dur dans les composants.
- **Thème sombre / clair** (existant) : tokens CSS sur `:root`, sombre par défaut, choix persisté. Les particules s'adaptent au thème (couleur, mode de fusion).
- **PDF servis depuis `public/docs/`** : `cv-marc-foucher-fr.pdf`, `cv-marc-foucher-en.pdf`, `lettre-recommandation-all4tec.pdf`, `rapport-stage-ebios-rm.pdf`. Le bouton CV sert le PDF de la langue active.
- **Page Dossier S3** (`dossier.html`) : conservée comme route `/dossier/`, sobre, même design system, sans 3D lourde.
- Tout le contenu (texte, liens, PDF) doit rester accessible **sans WebGL** et sans JavaScript lourd chargé.

## Direction artistique retenue : « Awwwards »

Inspirée des Sites of the Day Awwwards (portfolios de développeurs créatifs) : un concept, un moment signature, le reste discipliné.

- **Signature** : un nuage unique de particules (un seul draw call) qui se transforme au scroll : **cymbale ride** (hero, Marc est batteur depuis 9 ans) → **vague** (manifeste) → **D20** (étude de cas, une face par étape, clin d'œil aux dés 3D du stage) → **champ d'étoiles** (contenu) → **charleston** (contact). Un clic dans le hero ou le contact « frappe » la cymbale : onde radiale dans le shader + oscillation amortie ; chaque changement de section frappe aussi. Son de cymbale synthétisé (WebAudio, coupé par défaut, bouton « Son »). Le curseur repousse les particules ; la vitesse de scroll les agite.
- **Palette** : sombre par défaut, nuit `#0C0D10` et os `#EEEDE8` ; clair = os + encre. Un seul accent : orange `#FF5B1F`.
- **Typo** : Syne 800 en capitales pour les titres géants (ajustés à la largeur par `useFitText`), Schibsted Grotesk pour le texte, JetBrains Mono pour les petites étiquettes (`.label`).
- **Codes Awwwards utilisés** : preloader court avec compteur réel (1,2 à 4 s), rideau d'ouverture, nom pleine largeur, header en `mix-blend-mode: difference`, horloge de Laval, menu plein écran, curseur personnalisé, boutons magnétiques, manifeste révélé mot à mot au scroll, section épinglée, aperçu d'image qui suit le curseur, bandeaux défilants liés à la vitesse de scroll, grain.
- **Garde-fous** : tout le contenu reste dans le DOM et accessible ; mouvement réduit = pas de preloader, pas de smooth scroll, pas de curseur, particules figées ; pas de carrousel horizontal.

## Contenu source (à préserver, réorganiser, jamais inventer)

Le contenu vient de l'ancien `index.html`. Ne pas inventer de compétences, chiffres, dates ou projets.

- **Hero** : Marc Foucher, étudiant BUT Informatique (IUT Laval), recherche d'alternance 2026-2027. CTA : CV, lettre de recommandation, contact, GitHub, LinkedIn.
- **Compétences** : Java (POO, MVC, JavaFX, design patterns) · Web fullstack (HTML/CSS, JS, PHP, TypeScript, React) · BDD (SQL, MySQL, SQL Server, MCD/MLD) · Outils (Git, Linux, Docker, Figma, Agile) · 3D (React Three Fiber, Blender).
- **Stage ALL4TEC (avril-juillet 2026)** — projet phare : adaptation en ligne du serious game EBIOS RM. React, TypeScript, Colyseus (WebSockets), R3F, Blender, GitLab, Tuleap. Points clés : synchro temps réel, reconnexion après F5, interfaces `IState` partagées, dés 3D D4/D20 animés par quaternions (slerp), 330+ alertes ESLint corrigées, MVP validé. Démo : https://ebios-lejeu.all4tec.net/
- **Projets** : Morpion (Java MVC + IA), Timeline Game (JS MVC), Robot de trading (Python, API, BDD), UX/UI Figma (sites recyclage, primeur). Images existantes dans `images/`.
- **Parcours** : IUT Laval (en cours), TOEIC Listening B2, Projet Voltaire niveau Affaires, certification MOOC Club EBIOS, Bac général mention Bien (maths-physique).
- **Autres** : 5 ans de vente sur les marchés (relation client, autonomie), batterie (9 ans), handball.
- **Contact** : foucher.marc7@gmail.com · github.com/MarcFoucher7 · linkedin.com/in/marc-foucher-64397a38a/

Bugs de l'ancien site corrigés pendant la refonte (à ne pas réintroduire) : liens `TON_GITHUB` / `TON_LINKEDIN`, footer « © 2025 », `_config.yml` titré « Octocat's homepage ».

TODO connus : URL des dépôts GitHub des 4 projets (`repo` dans `src/content/profile.ts`).

## Stack

| Rôle      | Outil                                                                  |
| --------- | ---------------------------------------------------------------------- |
| Build     | Vite + React 18 + TypeScript strict                                    |
| 3D        | `three`, `@react-three/fiber` (shader de particules maison, sans drei) |
| Animation | `gsap` (ScrollTrigger, SplitText) + `@gsap/react` (`useGSAP`)          |
| Scroll    | `lenis` synchronisé avec ScrollTrigger                                 |
| État      | `zustand` (section active, progression, langue, thème, qualité 3D)     |
| Shaders   | `vite-plugin-glsl`                                                     |
| Qualité   | ESLint + Prettier stricts, `tsc --noEmit`                              |
| Assets    | Blender → `.glb` optimisé via `@gltf-transform/cli`                    |

Ne pas ajouter d'autre librairie sans justification écrite.

## Architecture

```
index.html           # page principale (script inline : langue + thème avant le rendu)
dossier/index.html   # page Dossier S3, HTML statique (spans .lang-fr / .lang-en)
src/
  main.tsx, App.tsx
  i18n/              # fr.ts, en.ts, useT() pour l'interface, useL() pour le contenu bilingue
  content/           # données typées : internship.ts, profile.ts (projets, compétences, parcours…)
  canvas/
    SceneHost.tsx    # détection WebGL, chargement de la scène pendant le preloader
    Experience.tsx   # <Canvas> unique, garde-fou de performance (dpr puis drawRange)
    Particles.tsx    # nuage de particules : morphing, placement par section, D20, curseur
    shapes.ts        # génération des 5 formes (cymbale, vague, D20, champ, charleston)
    shaders/         # particles.vert.glsl, particles.frag.glsl
    config.ts        # placements par section, couleurs, nombre de particules
  dom/
    sections/        # Hero, Manifesto, CaseStudy, Projects, Skills, Background, Beyond, Contact, Footer
    ui/              # Preloader, Header, Menu, Cursor, Marquee, Toggles
  hooks/             # useFitText, useReveal, useMagnetic, useSectionTracking, useClock, useStrikes
  animation/         # Lenis piloté par le ticker GSAP, verrouillage du scroll, cymbal.ts (frappe + son)
  store/             # app.ts (zustand), scroll.ts (valeurs mutables 60 fps), storage.ts
  styles/            # tokens.css, base.css (partagé), home.css
  dossier/           # script et styles de la page Dossier S3
public/
  docs/              # PDF (CV FR/EN, recommandation, rapport)
  images/            # visuels projets en WebP
  og.png, favicon.svg, robots.txt, sitemap.xml, dossier.html (redirection), .nojekyll
```

- **Un seul `<Canvas>`**, `position: fixed`, monté une fois. Jamais un Canvas par section.
- Le DOM porte le contenu (SEO, accessibilité) ; la 3D réagit au store (section, progression du scroll).
- Contenu typé dans `src/content/`, jamais en dur dans le JSX.

## Règles R3F / Three.js

- **Jamais** de `setState` dans `useFrame` : muter les refs.
- **Jamais** d'allocation (`new Vector3`, géométrie, matériau) dans `useFrame` : `useMemo` ou constante module.
- Animations basées sur `delta` ; amortissement via `THREE.MathUtils.damp` ou `maath/easing`.
- `useGLTF` + `useGLTF.preload`, sous `<Suspense>` ; objets répétés en `<Instances>`.
- Canvas : `dpr={[1, 2]}`, `<PerformanceMonitor>` + `<AdaptiveDpr>` ; mode qualité « low » auto sur mobile faible.
- Rotations : quaternions + `slerp` (savoir-faire déjà maîtrisé, à valoriser).
- `outputColorSpace = SRGBColorSpace`, tone mapping `ACESFilmic` ou `AgX`.
- `dispose()` de tout ce qui est créé manuellement.

## Animation & scroll

- Lenis pilote le scroll : `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`.
- Une timeline par section, `scrub` pour le lié-au-scroll ; animer la 3D via refs/uniforms, pas via le state React.
- `prefers-reduced-motion` : pas de smooth scroll, caméra statique, transitions en fondu.

## Budgets de performance

- JS initial (gzip) **< 250 ko** hors chunk 3D ; le chunk 3D est chargé en lazy (`React.lazy`) pendant le preloader.
- Assets 3D au premier chargement **< 3 Mo** ; `.glb` en Meshopt/Draco, textures KTX2 ou WebP ≤ 2048 px.
- Draw calls **< 100** ; triangles **< 300k** desktop, **< 150k** mobile.
- LCP **< 2,5 s**, CLS **< 0,1** ; Lighthouse ≥ 90 en Performance, Accessibilité, SEO.
- Sans WebGL : pas de scène, mais le site reste complet (le preloader se termine sans elle).
- Mesures actuelles (build de prod) : JS initial 112 ko gzip, chunk 3D 222 ko gzip chargé pendant le preloader. Lighthouse : accessibilité, bonnes pratiques et SEO à 100, CLS ≈ 0 ; performance 87 sans WebGL, plus basse avec la 3D en rendu logiciel (headless) : à mesurer sur un vrai navigateur.

```bash
npx @gltf-transform/cli optimize in.glb public/models/out.glb --compress meshopt --texture-compress ktx2
```

## Accessibilité & SEO

- Titres hiérarchisés, landmarks, focus visible, navigation clavier complète, contrastes AA dans les deux thèmes.
- Le canvas est `aria-hidden` ; aucune information n'existe uniquement en 3D.
- Balises `<title>`, meta description, Open Graph (image de partage), `hreflang` FR/EN, favicon.

## Conventions

- TypeScript strict, **aucun `any`**, JSDoc sur les fonctions exportées (standard appliqué en stage).
- Composants fonctionnels, un par fichier, PascalCase ; hooks en `useXxx`.
- Commits conventionnels (`feat:`, `fix:`, `perf:`, `refactor:`), un commit par étape logique.

## Workflow attendu

1. Avant chaque section : proposer la mise en scène en quelques lignes (caméra, mouvement, timing), attendre validation si c'est un choix de direction artistique.
2. Faire d'abord la version DOM complète et lisible, puis ajouter la 3D, puis raffiner (shaders, postprocessing).
3. Après chaque ajout 3D : indiquer l'impact (poids, draw calls, fps observés).
4. Ne jamais commiter d'asset non optimisé.
5. Une tâche n'est finie que si `npm run lint`, `npx tsc --noEmit` et `npm run build` passent.

## Commandes

```bash
npm run dev       # dev
npm run build     # build prod (dist/)
npm run preview   # test du build
npm run lint      # ESLint
npx tsc --noEmit  # typage
```
