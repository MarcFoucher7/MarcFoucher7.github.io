import {
  BackSide,
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector3,
  type ColorRepresentation,
} from 'three';
import type { Theme } from '../../store/app';
import { KEY_LIGHT, RIM_LIGHT } from './lighting';

interface Panel {
  /** Direction depuis la batterie (normalisée ensuite). */
  dir: Vector3;
  /** Distance au centre de la scène d'environnement. */
  dist: number;
  size: [number, number, number];
  color: ColorRepresentation;
  power: number;
}

const KIT_CENTER = new Vector3(0, 0.7, -0.1);

/**
 * Scène d'environnement du studio, rendue une fois en PMREM pour les reflets
 * (chromes, cymbales, vernis) : pièce lie-de-vin, boîte à lumière tungstène,
 * contre-jour sarcelle, bandeau LED ambré. Remplace le RoomEnvironment neutre,
 * qui donnait des chromes blancs « de catalogue ».
 */
export function createStudioEnvironment(theme: Theme): Scene {
  const scene = new Scene();
  const box = new BoxGeometry(1, 1, 1);
  const night = theme === 'dark';

  const room = new Mesh(
    box,
    new MeshBasicMaterial({ color: night ? '#a58a80' : '#e2d6cc', side: BackSide }),
  );
  room.scale.set(24, 14, 24);
  room.position.y = 4;
  scene.add(room);

  const floor = new Mesh(box, new MeshBasicMaterial({ color: night ? '#6e5040' : '#b09478' }));
  floor.scale.set(24, 0.1, 24);
  floor.position.y = -2.9;
  scene.add(floor);

  const panels: Panel[] = [
    // Boîte à lumière du projecteur principal.
    {
      dir: KEY_LIGHT.position.clone().sub(KIT_CENTER),
      dist: 7,
      size: [3.2, 0.12, 2.4],
      color: '#ffc58a',
      power: night ? 20 : 26,
    },
    // Contre-jour sarcelle : une fine réglette, juste un liseré sur les chromes.
    {
      dir: RIM_LIGHT.position.clone().sub(KIT_CENTER),
      dist: 8,
      size: [0.35, 2.6, 0.12],
      color: '#7fe3d8',
      power: night ? 6 : 3,
    },
    // Plafonnier diffus.
    {
      dir: new Vector3(0, 1, 0),
      dist: 6.8,
      size: [7, 0.1, 4],
      color: '#ffe2c4',
      power: night ? 3.5 : 6,
    },
    // Face caméra : donne un reflet lisible sur les fûts.
    {
      dir: new Vector3(0.3, 0.35, 1),
      dist: 9,
      size: [5, 2.6, 0.1],
      color: '#ffd8b4',
      power: night ? 4 : 7,
    },
  ];

  for (const p of panels) {
    const mat = new MeshBasicMaterial({ color: new Color(p.color).multiplyScalar(p.power) });
    const mesh = new Mesh(box, mat);
    mesh.scale.set(...p.size);
    mesh.position.copy(p.dir.normalize().multiplyScalar(p.dist));
    mesh.lookAt(0, 0, 0);
    scene.add(mesh);
  }

  // Bandeaux LED ambrés en bas et en haut du mur du fond, et le néon.
  const led = new MeshBasicMaterial({ color: new Color('#ff8a2a').multiplyScalar(night ? 6 : 3) });
  for (const y of [-2.6, 9.5]) {
    const strip = new Mesh(box, led);
    strip.scale.set(18, 0.18, 0.18);
    strip.position.set(0, y, -11.6);
    scene.add(strip);
  }
  const neon = new Mesh(
    box,
    new MeshBasicMaterial({ color: new Color('#ffa53d').multiplyScalar(night ? 8 : 4) }),
  );
  neon.scale.set(2.6, 1.2, 0.1);
  neon.position.set(0, 6.5, -11.7);
  scene.add(neon);

  return scene;
}

/** Libère géométries et matériaux d'une scène d'environnement. */
export function disposeEnvironment(scene: Scene): void {
  scene.traverse((o) => {
    if (o instanceof Mesh) {
      o.geometry.dispose();
      (o.material as MeshBasicMaterial).dispose();
    }
  });
}
