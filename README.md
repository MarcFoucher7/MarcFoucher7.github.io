# Portfolio de Marc Foucher

Portfolio de Marc Foucher, étudiant en BUT Informatique à l'IUT de Laval, en recherche d'alternance 2026-2027.
En ligne : https://marcfoucher7.github.io/

Un studio de musique en 3D avec une batterie jouable : clic sur les pièces, clavier (B, S, H, T, Y, F, C, R ; Maj + H ou G pour le charleston ouvert) ou pad du hero, groove à 96 BPM, et une vue éclatée qui présente les compétences pièce par pièce. Sons synthétisés en WebAudio : rien ne joue sans un geste de l'utilisateur, et le bouton « Son » coupe tout (préférence mémorisée).

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
