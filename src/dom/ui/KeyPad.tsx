import { hit } from '../../audio/hits';
import { KEY_LABEL, type PieceId } from '../../kit/ids';
import { useT } from '../../i18n';

const ORDER: PieceId[] = ['kick', 'snare', 'hihat', 'tom1', 'tom2', 'floor', 'crash', 'ride'];

/**
 * Pads accessibles : chaque bouton joue une pièce (souris, tactile, Entrée).
 * Ils affichent aussi les raccourcis clavier.
 */
export function KeyPad() {
  const t = useT();
  return (
    <div className="keypad" role="group" aria-label={t.hero.keysLabel}>
      {ORDER.map((id) => (
        <button
          key={id}
          type="button"
          className="keypad__key"
          onPointerDown={(e) => {
            if (e.pointerType !== 'touch') hit(id, 0.95);
          }}
          onClick={(e) => {
            // Clavier (Entrée/Espace) ou toucher : le clic arrive sans pointerdown souris.
            if (e.detail === 0 || (e.nativeEvent as PointerEvent).pointerType === 'touch')
              hit(id, 0.95);
          }}
        >
          <kbd>{KEY_LABEL[id]}</kbd>
          <span>{t.pieces[id]}</span>
        </button>
      ))}
    </div>
  );
}
