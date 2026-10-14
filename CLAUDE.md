# CLAUDE.md — Portfolio 3D de Marc Foucher

Refonte complète de `MarcFoucher7.github.io` : un studio de musique en 3D, avec une vraie batterie jouable au centre, qui porte tout le portfolio.
**Objectif business : décrocher une alternance BUT3 (2026-2027) en développement fullstack.** Le site doit prouver la maîtrise technique en 3 secondes et donner accès au CV en 1 clic.

Priorités, dans l'ordre : **contenu lisible & accès CV > performance (60 fps, mobile) > direction artistique > storytelling au scroll > finitions**.

## Contraintes non négociables

- **Hébergement : GitHub Pages, site utilisateur** (`https://marcfoucher7.github.io/`, base `/`). Build Vite → déploiement via GitHub Actions (`actions/deploy-pages`), pas de commit du `dist/`.
- **Bilingue FR / EN** : toutes les chaînes dans `src/i18n/fr.ts` et `src/i18n/en.ts`, langue persistée, attribut `<html lang>` à jour. Aucun texte en dur dans les composants.
- **Thème sombre / clair** : tokens CSS sur `:root`, sombre par défaut (« Session de nuit »), choix persisté. Le studio suit le thème : couleurs des murs, lumières, brouillard et environnement de reflets.
- **PDF servis depuis `public/docs/`** : `cv-marc-foucher-fr.pdf`, `cv-marc-foucher-en.pdf`, `lettre-recommandation-all4tec.pdf`, `rapport-stage-ebios-rm.pdf`. Le bouton CV sert le PDF de la langue active.
- **Page Dossier S3** (`dossier/index.html`) : route `/dossier/`, sobre, même design system, sans 3D.
- Tout le contenu (texte, liens, PDF) reste accessible **sans WebGL**, sans son et au clavier.

## Direction artistique : « Studio MF »

Un studio d'enregistrement de nuit, filmé comme un clip. Marc est batteur depuis 9 ans : la batterie est l'objet signature, et elle se joue.

- **Signature** : une batterie 5 fûts modélisée en procédural (dimensions réelles : grosse caisse 22", caisse claire 14", toms 10"/12", tom basse 16", charleston 14", crash 18", ride 20"). Chaque pièce se joue à la souris (clic, Maj + clic pour ouvrir le charleston), au clavier (B, S, H, G, T, Y, F, C, R) ou avec le pad du hero. Le son est synthétisé en WebAudio (aucun fichier audio), avec réverbération, compresseur et VU-mètre. Le bouton « Lancer le groove » joue un rythme à 96 BPM qui anime toute la scène (néon, LED, projecteur, caméra, REC qui clignote).
- **Vue éclatée** (section Compétences, épinglée sur grand écran) : le scroll démonte la batterie (cercles, peaux, tirants, fûts), puis met en avant une pièce par groupe de compétences, avec des étiquettes accrochées en 3D et une carte de détail ; elle se remonte en fin de section. Sur mobile, les mêmes contenus sont présentés en cartes, avec un bouton « Écouter » par pièce.
- **Plans de caméra par section** : hero (batterie entière), manifeste (gros plan sur la peau de grosse caisse au logo MF), vue éclatée (orbite), étude de cas (le D20 sur le guéridon, qui roule à chaque étape), projets (l'écran du studio affiche le projet survolé), parcours (vue de dessus, en setlist), à côté du code (vue du tabouret), contact (plan large).
- **Décor** : murs lie-de-vin, mousse acoustique, diffuseur en bois, tapis à motifs, néon « MF », bandeaux LED ambrés, enceintes, micro overhead, guéridon et D20, écran mural avec voyant REC.
- **Palette** : nuit `#150A0D` (fond), crème `#F6EAD9` (texte), ambre tungstène `#FF9A2E` (accent), sarcelle `#5FD8C9` (repères techniques, vue éclatée), rouge REC `#FF3D4A`, laque émeraude pailletée `#0D5B52` pour les fûts. Jour : papier chaud `#F1E5D5` et encre lie-de-vin `#26090E`.
- **Typo** : Big Shoulders Display (titres, affiche de concert, ajustés à la largeur par `useFitText`), Schibsted Grotesk (texte), JetBrains Mono (étiquettes `.label`, touches `kbd`).
- **Codes Awwwards utilisés** : preloader « Soundcheck » avec compteur réel, nom pleine largeur, en-tête avec horloge du studio et groove, menu plein écran, curseur personnalisé qui nomme la pièce survolée, boutons magnétiques, manifeste révélé mot à mot, sections épinglées, grain, voile de lisibilité dosé par section.
- **Garde-fous** : tout le contenu reste dans le DOM et accessible ; aucun son sans geste de l'utilisateur (clic, touche), bouton « Son » pour tout couper (préférence persistée) ; mouvement réduit = pas de preloader, pas de smooth scroll, pas de curseur, caméra sans transition.

## Contenu source (à préserver, réorganiser, jamais inventer)

Ne pas inventer de compétences, chiffres, dates ou projets.

- **Hero** : Marc Foucher, étudiant BUT Informatique (IUT Laval), recherche d'alternance 2026-2027. CTA : CV, lettre de recommandation, contact, GitHub, LinkedIn.
- **Compétences** (une pièce de la batterie par groupe, `src/content/kit.ts`) : grosse caisse = fondations Java (POO, MVC, JavaFX, design patterns) · caisse claire = web fullstack · toms = temps réel et 3D (Colyseus, R3F, Three.js, Blender) · tom basse = bases de données (SQL, MySQL, SQL Server, MCD/MLD) · charleston = outils et méthode (Git, Linux, Docker, Figma, ESLint, Scrum/Tuleap) · crash = savoir-être · ride = langues et certifications.
- **Stage ALL4TEC (avril-juillet 2026)** — projet phare : adaptation en ligne du serious game EBIOS RM. React, TypeScript, Colyseus (WebSockets), R3F, Blender, GitLab, Tuleap. Points clés : synchro temps réel, reconnexion après F5, interfaces `IState` partagées, dés 3D D4/D20 animés par quaternions (slerp), 330+ alertes ESLint corrigées, MVP validé. Démo : https://ebios-lejeu.all4tec.net/
- **Projets** : Morpion (Java MVC + IA), Timeline Game (JS MVC), Robot de trading (Python, API, BDD), UX/UI Figma (sites recyclage, primeur). Images dans `public/images/`.
- **Parcours** : IUT Laval (en cours), TOEIC Listening B2, Projet Voltaire niveau Affaires, certification MOOC Club EBIOS, Bac général mention Bien (maths-physique).
- **Autres** : 5 ans de vente sur les marchés (relation client, autonomie), batterie (9 ans), handball.
- **Contact** : foucher.marc7@gmail.com · github.com/MarcFoucher7 · linkedin.com/in/marc-foucher-64397a38a/

Bugs de l'ancien site corrigés (à ne pas réintroduire) : liens `TON_GITHUB` / `TON_LINKEDIN`, footer « © 2025 », `_config.yml` titré « Octocat's homepage ».

TODO connus : URL des dépôts GitHub des 4 projets (`repo` dans `src/content/profile.ts`).

## Stack

| Rôle      | Outil                                                                                 |
| --------- | ------------------------------------------------------------------------------------- |
| Build     | Vite + React 18 + TypeScript strict                                                   |
| 3D        | `three`, `@react-three/fiber` (sans drei), géométries procédurales                    |
| Post      | `@react-three/postprocessing` : Bloom, Vignette, ToneMapping ACES (qualité haute)     |
| Animation | `gsap` (ScrollTrigger, SplitText) + `@gsap/react` (`useGSAP`)                         |
| Scroll    | `lenis` piloté par le ticker GSAP                                                     |
| État      | `zustand` (section, langue, thème, qualité, son, groove) + objets mutables pour la 3D |
| Audio     | WebAudio natif : voix synthétisées, réverbération par convolution, séquenceur         |
| Qualité   | ESLint + Prettier stricts, `tsc --noEmit`                                             |

Ne pas ajouter d'autre librairie sans justification écrite.

## Architecture

```
index.html             # page principale (script inline : langue + thème avant le rendu)
dossier/index.html     # page Dossier S3, HTML statique (spans .lang-fr / .lang-en)
src/
  main.tsx, App.tsx
  i18n/                # fr.ts, en.ts, useT() pour l'interface, useL() pour le contenu bilingue
  content/             # données typées : internship.ts, profile.ts, kit.ts (compétences par pièce)
  kit/ids.ts           # identifiants des pièces, raccourcis clavier
  audio/
    engine.ts          # contexte WebAudio paresseux, compresseur, réverb, analyseur (VU-mètre)
    voices.ts          # synthèse : grosse caisse, caisse claire, toms, cymbales (banc métallique)
    hits.ts            # hit() = son + événement visuel ; onHit() pour la 3D
    groove.ts          # séquenceur 96 BPM avec anticipation, onBeat()
  canvas/
    SceneHost.tsx      # détection WebGL, chargement de la scène pendant le preloader
    Experience.tsx     # <Canvas> unique (événements écoutés sur #root), garde-fou de performance
    CameraRig.tsx      # un plan par section, orbite de la vue éclatée, parallaxe, secousse
    Effects.tsx        # post-traitement (qualité haute uniquement)
    state.ts           # kitState : éclatement, focus, survol, énergies, étiquettes projetées
    kit/               # la batterie : Kit, Piece (interaction), Drum, Cymbal/HiHat, Stands,
                       # layout (implantation + éclatement), geometry, materials, textures
    studio/            # le décor : Room, Props, Monitor, D20, Lights, lighting, environment
  dom/
    sections/          # Hero, Manifesto, KitSection, CaseStudy, Projects, Background, Beyond, Contact, Footer
    ui/                # Preloader, Header, Menu, Cursor, KeyPad, GrooveButton, VuMeter, Toggles
  hooks/               # useFitText, useReveal, useMagnetic, useSectionTracking, useClock, useDrumKeys, useAudioSync
  animation/lenis.ts   # Lenis piloté par le ticker GSAP, verrouillage du scroll
  store/               # app.ts (zustand), scroll.ts (valeurs mutables 60 fps), storage.ts
  styles/              # tokens.css, base.css (partagé), home.css
  dossier/             # script et styles de la page Dossier S3
public/
  docs/                # PDF (CV FR/EN, recommandation, rapport)
  images/              # visuels projets en WebP (affichés aussi sur l'écran du studio)
  og.png, favicon.svg, robots.txt, sitemap.xml, dossier.html (redirection), .nojekyll
```

- **Un seul `<Canvas>`**, `position: fixed`, monté une fois. Ses événements sont écoutés sur `#root` : `main` a `pointer-events: none`, seuls les blocs d'interface (`[data-ui]`, liens, boutons) les reprennent, pour que la batterie reste jouable à travers le texte.
- Le DOM porte le contenu (SEO, accessibilité) ; la 3D réagit au store (section) et à `kitState` (éclatement, frappes).
- Contenu typé dans `src/content/`, jamais en dur dans le JSX.
- Aucun fichier 3D ni audio : tout est procédural (géométries, textures canvas, environnement PMREM, sons). Si un `.glb` est ajouté un jour, l'optimiser avant de le commiter (voir plus bas).

## Règles R3F / Three.js

- **Jamais** de `setState` dans `useFrame` : muter les refs ou `kitState`.
- **Jamais** d'allocation (`new Vector3`, géométrie, matériau) dans `useFrame` : `useMemo` ou constante module.
- Animations basées sur `delta` (borné à 0,1 s) ; amortissement exponentiel ou `MathUtils.damp`.
- Objets répétés en `InstancedMesh` (tirants, mousse, diffuseur) ; pièces fixes fusionnées (`mergeGeometries`) pour limiter les draw calls.
- Rotations : quaternions + `slerp` (le D20, savoir-faire du stage).
- `outputColorSpace = SRGBColorSpace`, tone mapping ACES Filmic.
- `dispose()` de tout ce qui est créé manuellement (géométries, matériaux, textures, environnement).
- Le rendu s'arrête quand le menu plein écran est ouvert (`frameloop="never"`).

## Animation & scroll

- Lenis pilote le scroll : `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`.
- Sections épinglées (vue éclatée, étude de cas) en `gsap.matchMedia()` : épinglées au-dessus de 900 px, en cartes empilées en dessous.
- Dans `onUpdate`, ignorer l'appel si `!self.isActive` : il passe après `onToggle`, et un saut au-delà de la section (lien du menu) laisserait sinon l'état « éclaté ». La batterie se remonte aussi d'office hors de la section `kit`.
- `prefers-reduced-motion` : pas de smooth scroll, caméra sans transition, transitions CSS à **0 s** (pas 0,01 ms : une durée non nulle fait lire d'anciennes valeurs à ScrollTrigger et à `useFitText`).
- Titres révélés par ligne (SplitText `mask: 'lines'`) : le masque `.split-mask-line-mask` a un padding haut pour ne pas couper les accents des capitales.

## Budgets de performance

- JS initial (gzip) **< 250 ko** hors chunk 3D ; le chunk 3D est chargé en lazy pendant le preloader.
- Draw calls **< 100** dans la passe principale ; triangles **< 300k** desktop, **< 150k** mobile.
- LCP **< 2,5 s**, CLS **< 0,1** ; Lighthouse ≥ 90 en Accessibilité, Bonnes pratiques, SEO.
- Garde-fou : sous 40 fps, DPR à 1, puis qualité basse (sans ombres ni post-traitement). Mobile : qualité basse d'office.
- Sans WebGL : pas de scène, mais le site reste complet (le preloader se termine sans elle).
- Mesures actuelles (build de prod) : JS initial 118 ko gzip ; chunk 3D 252 ko gzip ; ≈ 70 draw calls et ≈ 85k triangles en vue éclatée (passe principale). Aucun asset 3D ni audio téléchargé.

```bash
npx @gltf-transform/cli optimize in.glb public/models/out.glb --compress meshopt --texture-compress ktx2
```

## Accessibilité & SEO

- Titres hiérarchisés, landmarks, focus visible, navigation clavier complète, contrastes AA dans les deux thèmes (voile de lisibilité `.scrim`, portée réglée par section).
- Le canvas est `aria-hidden` ; aucune information n'existe uniquement en 3D (la vue éclatée a sa liste complète dans le DOM, chaque pièce a son bouton).
- Raccourcis clavier de la batterie ignorés dans les champs de saisie et avec Ctrl/Cmd/Alt.
- Balises `<title>`, meta description, Open Graph (`public/og.png`, capture du hero), `hreflang` FR/EN, favicon.

## Outils de mise au point

- `?debug` expose `window.__studio` (`kitState`, `useApp`, `ScrollTrigger`, `gl` pour `gl.info.render`).
- `?nointro` saute le preloader ; `?snap` supprime les transitions de caméra ; `?hq` fige la qualité haute (captures, image de partage).

## Conventions

- TypeScript strict, **aucun `any`**, pas d'assertion non nulle, JSDoc sur les fonctions exportées (standard appliqué en stage).
- Composants fonctionnels, un par fichier, PascalCase ; hooks en `useXxx`.
- Commits conventionnels (`feat:`, `fix:`, `perf:`, `refactor:`), un commit par étape logique.
- Attention à la casse des noms de fichiers : le Mac est insensible à la casse, GitHub Actions (Linux) ne l'est pas.

## Workflow attendu

1. Avant chaque section : proposer la mise en scène en quelques lignes (caméra, mouvement, timing), attendre validation si c'est un choix de direction artistique.
2. Faire d'abord la version DOM complète et lisible, puis ajouter la 3D, puis raffiner.
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
