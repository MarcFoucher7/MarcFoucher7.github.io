# CLAUDE.md — Portfolio 3D de Marc Foucher

Refonte complète de `MarcFoucher7.github.io` : passer d'un site HTML/CSS statique à un portfolio 3D immersif, niveau agence / Awwwards.
**Objectif business : décrocher une alternance BUT3 (2026-2027) en développement fullstack.** Le site doit prouver la maîtrise technique en 3 secondes et donner accès au CV en 1 clic.

Priorités, dans l'ordre : **contenu lisible & accès CV > performance (60 fps, mobile) > direction artistique > storytelling au scroll > finitions**.

## Contraintes non négociables

- **Hébergement : GitHub Pages, site utilisateur** (`https://marcfoucher7.github.io/`, base `/`). Build Vite → déploiement via GitHub Actions (`actions/deploy-pages`), pas de commit du `dist/`.
- **Bilingue FR / EN** (existant) : toutes les chaînes dans `src/i18n/fr.ts` et `src/i18n/en.ts`, langue persistée, attribut `<html lang>` à jour. Aucun texte en dur dans les composants.
- **Thème sombre / clair** (existant) : tokens CSS sur `:root`, respect de `prefers-color-scheme`, choix persisté. La scène 3D s'adapte au thème (fond, lumières, couleur d'accent).
- **PDF à conserver et servir depuis `public/`** : `cv_FOUCHER_Marc.pdf`, `CVMARCen.pdf` (CV EN), `Lettre_Recommandation_ALL4TEC.pdf`, rapport de stage EBIOS RM. Le bouton CV sert le PDF de la langue active.
- **Page Dossier S3** (`dossier.html`) : conservée comme route `/dossier/`, sobre, même design system, sans 3D lourde.
- Tout le contenu (texte, liens, PDF) doit rester accessible **sans WebGL** et sans JavaScript lourd chargé.

## Direction artistique retenue : « Synchro »

Le site raconte le temps réel du stage (Colyseus). Deux écrans 3D, **client A** et **client B**, sont reliés par un flux de paquets. Chaque changement d'état (section visible, langue, thème) part de A sous forme de paquet orange ; B ne l'affiche qu'à l'arrivée et renvoie un accusé de réception. Au rechargement (F5), la ligne d'état rejoue la reconnexion par token.

- **Palette** : clair « papier technique » `#F3F5F7`, sombre « bleu ardoise » `#1C2533`, orange paquet `#FF6B2C` (accent, CTA), cyan signal `#2BC4D8` (requêtes), vert ack `#3DBE7A` (accusés). Variantes texte AA dans `src/styles/tokens.css`.
- **Typo** : Schibsted Grotesk (titres et texte), JetBrains Mono **uniquement** pour le code affiché dans les écrans 3D.
- **Motif** : le petit carré « paquet » (puces, indicateur de nav, timeline). Pas d'emojis, pas de surtitres en capitales, pas de cartes identiques à ombre portée.
- **Mouvement** : un seul moment orchestré au chargement (le nom arrive lettre par lettre) ; le reste du mouvement est porté par la 3D.
- **Mise en page** : contenu aligné à gauche dans une colonne de 58 % sur grand écran, la droite appartient à la scène. Sur mobile, la scène reste en haut du hero puis s'efface au scroll.

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

| Rôle             | Outil                                                                             |
| ---------------- | --------------------------------------------------------------------------------- |
| Build            | Vite + React 18 + TypeScript strict                                               |
| 3D               | `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` |
| Animation        | `gsap` + `ScrollTrigger` + `@gsap/react` (`useGSAP`)                              |
| Scroll           | `lenis` synchronisé avec ScrollTrigger                                            |
| État             | `zustand` (section active, progression, langue, thème, qualité 3D)                |
| Shaders          | `vite-plugin-glsl`                                                                |
| Debug (dev only) | `leva`, `r3f-perf`                                                                |
| Qualité          | ESLint + Prettier stricts, `tsc --noEmit`                                         |
| Assets           | Blender → `.glb` optimisé via `@gltf-transform/cli`                               |

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
    SceneHost.tsx    # détection WebGL, chargement différé, illustration de repli
    Experience.tsx   # <Canvas> unique, fixe derrière le DOM
    Scene.tsx        # lumières + lignes de code affichées par A et B
    Rig.tsx          # disposition des clients selon le scroll, ancrages du flux
    layout.ts        # calcul pur de la disposition (desktop / mobile, hero / contenu)
    rig.ts           # état mutable partagé du flux (courbe de Bézier)
    objects/         # ClientScreen, CodeLines, PacketStream, StatePacket
    effects/         # Bloom (sombre + grand écran uniquement)
    config.ts        # couleurs, dimensions, durées
  dom/
    sections/        # Hero, Internship, Projects, Skills, Background, Beyond, Contact, Footer
    ui/              # Nav, Toggles, ConnectionStatus
  animation/         # Lenis + ScrollTrigger, suivi des sections
  store/             # app.ts (zustand), scroll.ts (valeurs mutables 60 fps), storage.ts
  styles/            # tokens.css, global.css
  dossier/           # script et styles de la page Dossier S3
public/
  docs/              # PDF (CV FR/EN, recommandation, rapport)
  images/            # visuels projets en WebP
  og.png, favicon.svg, robots.txt, sitemap.xml, .nojekyll
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

- JS initial (gzip) **< 250 ko** hors chunk 3D ; le chunk 3D est chargé en lazy (`React.lazy`) après le premier rendu du hero DOM.
- Assets 3D au premier chargement **< 3 Mo** ; `.glb` en Meshopt/Draco, textures KTX2 ou WebP ≤ 2048 px.
- Draw calls **< 100** ; triangles **< 300k** desktop, **< 150k** mobile.
- LCP **< 2,5 s**, CLS **< 0,1** ; Lighthouse ≥ 90 en Performance, Accessibilité, SEO.
- Fallback sans WebGL : visuel statique + contenu complet.
- Mesures actuelles (build de prod) : JS initial 107 ko gzip, chunk 3D 284 ko gzip chargé après `load`. Lighthouse sans WebGL : 97 en performance ; avec la 3D en rendu logiciel (headless), le TBT monte à cause du rendu : à mesurer sur un vrai navigateur.

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
- `leva` / `r3f-perf` uniquement sous `import.meta.env.DEV`.
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
