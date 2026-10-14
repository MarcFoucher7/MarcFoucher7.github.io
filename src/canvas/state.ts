import { PIECE_IDS, type PieceId } from '../kit/ids';

/** Énergie de frappe par pièce (0 à 1), décroît dans la boucle de rendu. */
export interface PieceEnergy {
  value: number;
  /** Secondes écoulées depuis la dernière frappe. */
  age: number;
  /** Charleston ouvert lors de la dernière frappe. */
  open: boolean;
}

/**
 * État mutable partagé entre la scène, l'audio et le DOM, lu à 60 fps.
 * Jamais de setState React ici.
 */
export const kitState = {
  /** Progression de la vue éclatée voulue par le scroll (0 à 1). */
  explodeTarget: 0,
  /** Valeur lissée réellement appliquée. */
  explode: 0,
  /** Pièce mise en avant dans la vue éclatée (-1 : aucune). */
  focus: -1,
  /** Pièce survolée par le pointeur. */
  hovered: null as PieceId | null,
  /** Pulsation lumineuse globale (frappes + niveau audio). */
  pulse: 0,
  /** Petit tremblement de caméra (grosse caisse). */
  shake: 0,
  /** Projet affiché sur l'écran du studio. */
  activeProject: 0,
  /** Étiquettes de la vue éclatée : position écran (px) de chaque pièce. */
  labels: Object.fromEntries(PIECE_IDS.map((id) => [id, { x: 0, y: 0, visible: false }])) as Record<
    PieceId,
    { x: number; y: number; visible: boolean }
  >,
  energy: Object.fromEntries(
    PIECE_IDS.map((id) => [id, { value: 0, age: 99, open: false }]),
  ) as Record<PieceId, PieceEnergy>,
};
