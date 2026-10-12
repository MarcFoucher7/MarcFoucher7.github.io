# Portfolio de Marc Foucher

Portfolio de Marc Foucher, étudiant en BUT Informatique à l'IUT de Laval, en recherche d'alternance 2026-2027.
En ligne : https://marcfoucher7.github.io/

Vite, React 18, TypeScript strict, React Three Fiber, GSAP et Lenis. Bilingue FR/EN, thème clair/sombre.

## Développement

```bash
npm install
npm run dev       # http://localhost:5173
npm run lint
npm run build     # vérifie les types puis construit dist/
npm run preview   # sert le build
```

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml`, qui construit le site et le publie sur GitHub Pages.
Dans les réglages du dépôt : **Settings → Pages → Source → GitHub Actions**.

Les règles du projet sont dans `CLAUDE.md`.
