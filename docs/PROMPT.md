# Prompt de lancement — à coller dans Claude Code à la racine du dépôt

Modèle conseillé : **Claude Opus 5.5** (ou Fable 5.1) pour les phases 0 à 3 et les shaders ; Sonnet 5.5 suffit pour les retouches de contenu et de style.

---

Tu vas réaliser la refonte complète de mon portfolio `MarcFoucher7.github.io` en site 3D immersif, du niveau de ce qu'une agence facturerait plus de 10 000 €. Lis d'abord `CLAUDE.md` et la skill `portfolio-3d` : ce sont les règles du projet, elles priment sur tes habitudes.

**Contexte.** Je suis étudiant en BUT Informatique à l'IUT de Laval et je cherche une alternance 2026-2027 en développement fullstack. Le site actuel (`index.html`, `style.css`, `dossier.html`) est un site statique bilingue FR/EN avec thème sombre/clair. Le futur site doit faire comprendre en quelques secondes que je sais construire des expériences web avancées (temps réel, 3D, TypeScript strict), et permettre de télécharger mon CV en un clic.

**Ce qui fait la différence avec un portfolio classique :**
- Un **concept signature** unique qui structure tout le scroll, lié à mon histoire. Piste à explorer en priorité : le **dé D20** que j'ai modélisé dans Blender et animé en quaternions pendant mon stage ALL4TEC. Il pourrait devenir le fil conducteur, avec une face ou une rotation par section. Propose aussi deux autres pistes crédibles (par exemple autour de la batterie, que je pratique depuis 9 ans, ou du temps réel/réseau) pour que je choisisse.
- Une section **Stage ALL4TEC** traitée comme une étude de cas : problème, choix techniques, résultats, lien vers la démo.
- Des finitions soignées : loader, transitions de section, curseur et micro-interactions, typographie expressive, sons optionnels coupés par défaut.

**Déroulé imposé, avec un commit par étape :**

0. **Audit et direction artistique** (sans écrire de code). Extrais tout le contenu de l'ancien site et liste ce que tu vas garder, fusionner ou supprimer. Propose 3 directions artistiques : concept, palette, typographies, mouvement caméra par section, références d'inspiration. **Arrête-toi et attends mon choix.**
1. **Fondations.** Initialise Vite + React + TS strict, ESLint/Prettier, i18n FR/EN, tokens de thème, store, Lenis + GSAP, structure de dossiers de `CLAUDE.md`. Déplace les PDF et images dans `public/`. Ajoute le workflow GitHub Pages.
2. **Version DOM complète.** Toutes les sections avec le vrai contenu, responsive, accessible, bilingue, sans 3D. Le site doit déjà être présentable à ce stade.
3. **Expérience 3D.** Canvas unique, objet signature, caméra pilotée par le scroll, adaptation au thème, fallback sans WebGL, chargement lazy.
4. **Polish.** Shaders, postprocessing léger, transitions de texte, loader, curseur, hovers des cartes projets.
5. **Page Dossier S3** migrée en route `/dossier/` avec le même design system.
6. **Audit final.** Lighthouse (mobile et desktop), budgets de performance, accessibilité, `prefers-reduced-motion`, test en 375 px. Corrige ce qui ne passe pas, puis fais-moi un récapitulatif chiffré.

**Règles :**
- N'invente aucun contenu (compétences, chiffres, projets). S'il manque une information ou un visuel, liste-le et mets un placeholder clairement marqué `TODO`.
- Après chaque étape, montre-moi le résultat (captures ou instructions pour `npm run dev`), donne l'impact sur la performance et attends mon feu vert avant l'étape suivante.
- Corrige au passage les bugs de l'ancien site listés dans `CLAUDE.md`.

Commence par l'étape 0.
