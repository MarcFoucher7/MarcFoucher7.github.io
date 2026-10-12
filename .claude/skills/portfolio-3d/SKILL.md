---
name: portfolio-3d
description: Use when building, adding or polishing a section, 3D object, shader, scroll animation or asset in Marc's 3D portfolio (React Three Fiber + GSAP + Lenis on GitHub Pages). Gives the step-by-step procedure, quality gates and ready-made patterns.
---

# Portfolio 3D — procédure de réalisation

Cette skill complète `CLAUDE.md` (règles du projet). Elle décrit **comment** produire chaque élément pour atteindre un rendu « agence », sans sacrifier la performance ni le contenu.

## 1. Procédure pour toute nouvelle section

1. **Contenu d'abord** : ajouter les données typées dans `src/content/` et les chaînes FR + EN dans `src/i18n/`. Vérifier qu'aucune info n'est inventée par rapport à `CLAUDE.md`.
2. **DOM complet** : créer `src/dom/sections/<Section>.tsx`, sémantique (`<section id aria-labelledby>`), responsive, lisible sans 3D.
3. **Mise en scène** : écrire en 3-5 lignes l'intention (ce que fait la caméra, l'objet, le texte, sur quelle portion du scroll). La soumettre si c'est un choix artistique nouveau.
4. **Câblage état** : la section publie sa progression dans le store (`ScrollTrigger` `onUpdate` → `useStore.setState({ progress })` hors `useFrame`, ou mieux une ref partagée).
5. **3D** : composant dans `src/canvas/objects/`, qui lit la progression via ref et anime dans `useFrame` avec `damp`.
6. **Polish** : micro-interactions (hover, curseur magnétique), transitions de texte (split lignes/mots), postprocessing léger.
7. **Quality gate** (section 6).

## 2. Patterns de référence

### Synchro Lenis + GSAP (une seule fois, dans `src/animation/lenis.ts`)

```ts
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Initialise le smooth scroll, sauf si l'utilisateur préfère réduire les animations. */
export function initLenis(): Lenis | null {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
```

### Progression de scroll partagée sans re-render

```ts
// src/store/scroll.ts
/** Valeurs mutables lues dans useFrame : jamais de setState à 60 fps. */
export const scrollState = { progress: 0, section: 0 };
```

```tsx
// Dans une section DOM
useGSAP(() => {
  ScrollTrigger.create({
    trigger: ref.current,
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => { scrollState.progress = self.progress; },
  });
}, { scope: ref });
```

```tsx
// Dans un objet 3D
useFrame((_, delta) => {
  const m = mesh.current;
  if (!m) return;
  m.rotation.y = THREE.MathUtils.damp(m.rotation.y, scrollState.progress * Math.PI * 2, 4, delta);
});
```

### Rotation vers une face (quaternion + slerp)

```ts
const target = useMemo(() => new THREE.Quaternion(), []);
useFrame((_, delta) => {
  target.setFromEuler(FACE_ROTATIONS[scrollState.section]);
  mesh.current?.quaternion.slerp(target, 1 - Math.exp(-6 * delta));
});
```

### Matériau shader typé

```tsx
const GradientMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color('#1DB954') },
  vertex,
  fragment,
);
extend({ GradientMaterial });
declare module '@react-three/fiber' {
  interface ThreeElements {
    gradientMaterial: ThreeElement<typeof GradientMaterial>;
  }
}
```

### Thème → scène

La scène lit le thème du store et interpole couleurs de fond, lumières et accent (`color.lerp` dans `useFrame`), jamais de remontage du Canvas.

### Chargement

- Hero DOM rendu immédiatement ; `Experience` importé via `React.lazy` puis monté après `requestIdleCallback`.
- Loader basé sur `useProgress`, minimal (barre + pourcentage), sortie animée, jamais bloquant plus de 3 s : au-delà, afficher le site sans la 3D et la laisser apparaître en fondu.

## 3. Assets

1. Modéliser dans Blender, appliquer les transformations, origine centrée, échelle réelle.
2. Exporter en `.glb` (Y up, sans caméras ni lumières inutiles).
3. Optimiser :
   ```bash
   npx @gltf-transform/cli optimize raw/x.glb public/models/x.glb --compress meshopt --texture-compress ktx2
   npx @gltf-transform/cli inspect public/models/x.glb
   ```
4. Si possible, générer un composant typé : `npx gltfjsx public/models/x.glb --types --transform`.
5. Noter le poids final et le nombre de triangles dans la PR / le message.

## 4. Direction artistique — garde-fous

- **Un concept signature** répété dans tout le site plutôt que dix effets disparates.
- Typographie : 1 display expressive + 1 texte lisible (Google Fonts, `font-display: swap`, 2 graisses max par famille).
- Grille et rythme vertical stricts ; beaucoup d'espace négatif.
- Mouvement : easings cohérents (`power3.out`, `expo.inOut`), durées 0,6-1,2 s, rien qui clignote.
- Le texte reste toujours lisible au-dessus de la 3D (contraste vérifié dans les deux thèmes).

## 5. Déploiement GitHub Pages

`vite.config.ts` avec `base: '/'`. Workflow `.github/workflows/deploy.yml` :

```yaml
name: Deploy
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

Dans les réglages du dépôt : Pages → Source → **GitHub Actions**. Supprimer `_config.yml` (Jekyll inutile) et ajouter `public/.nojekyll`.

## 6. Quality gate (avant de dire « fini »)

- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` passent sans warning.
- [ ] FR et EN complets, aucun texte en dur.
- [ ] Thèmes sombre et clair vérifiés, contraste AA.
- [ ] `prefers-reduced-motion` testé.
- [ ] Rendu sans WebGL : tout le contenu et les PDF accessibles.
- [ ] Taille du build et des `.glb` dans les budgets de `CLAUDE.md`.
- [ ] Testé en 375 px de large et en 1440 px.
- [ ] Aucun `console.log`, aucun `any`, `leva`/`r3f-perf` absents du build prod.
