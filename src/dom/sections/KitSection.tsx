import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { scrollToTarget } from '../../animation/lenis';
import { emitHit, hit } from '../../audio/hits';
import { kitState } from '../../canvas/state';
import { KIT_ORDER, kitContent } from '../../content/kit';
import { useReveal } from '../../hooks/useReveal';
import { useL, useT } from '../../i18n';
import { KEY_LABEL, PIECE_IDS, type PieceId } from '../../kit/ids';
import { useApp } from '../../store/app';

gsap.registerPlugin(ScrollTrigger);

// Progression de l'épinglage : démontage sur [0, OPEN], une pièce par tranche
// de FIRST à CLOSE, puis remontage.
const OPEN = 0.12;
const FIRST = 0.15;
const CLOSE = 0.92;
const STEP = (CLOSE - FIRST) / KIT_ORDER.length;

/** Étiquettes flottantes accrochées aux pièces 3D (positions projetées à chaque image). */
function KitTags({ focus }: { focus: PieceId | null }) {
  const t = useT();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const tags = Array.from(el.querySelectorAll<HTMLElement>('[data-piece]'));
    const tick = (): void => {
      const show = useApp.getState().section === 'kit' && kitState.explode > 0.45;
      el.style.opacity = show ? '1' : '0';
      if (!show) return;
      for (const tag of tags) {
        const p = kitState.labels[tag.dataset.piece as PieceId];
        tag.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
        tag.style.visibility = p.visible ? 'visible' : 'hidden';
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  return (
    <div className="kit-tags" ref={root} aria-hidden="true" data-focusing={focus !== null}>
      {PIECE_IDS.map((id) => (
        <span
          className="kit-tag"
          key={id}
          data-piece={id}
          data-focus={focus === id || (focus === 'tom1' && id === 'tom2')}
        >
          <i className="kit-tag__dot" />
          <span className="kit-tag__text">
            {t.pieces[id]}
            <kbd>{KEY_LABEL[id]}</kbd>
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * Compétences en vue éclatée : la section est épinglée, le scroll démonte la batterie
 * puis met en avant chaque pièce et le groupe de compétences qu'elle porte.
 */
export function KitSection() {
  const t = useT();
  const l = useL();
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const [focus, setFocus] = useState(-1);
  const focusRef = useRef(-1);
  const trigger = useRef<ScrollTrigger | null>(null);
  useReveal(title);

  useGSAP(
    () => {
      const n = KIT_ORDER.length;
      const apply = (index: number): void => {
        if (focusRef.current === index) return;
        focusRef.current = index;
        const piece = KIT_ORDER[index];
        kitState.focus = piece ? PIECE_IDS.indexOf(piece) : -1;
        // Petite frappe visuelle (sans son) sur la pièce qui arrive.
        if (piece) emitHit({ piece, velocity: 0.55, variant: 'closed' });
        setFocus(index);
      };
      const reset = (): void => {
        kitState.explodeTarget = 0;
        kitState.focus = -1;
        focusRef.current = -1;
        setFocus(-1);
      };

      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        trigger.current = ScrollTrigger.create({
          trigger: pin.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * (n * 0.75 + 1.4)}`,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // onUpdate passe après onToggle : sans cette garde, un saut au-delà de la
            // section (lien du menu) laisserait la batterie éclatée.
            if (!self.isActive) return;
            const p = self.progress;
            kitState.explodeTarget = Math.min(1, p / OPEN, (1 - p) / (1 - CLOSE));
            apply(
              p < FIRST || p >= CLOSE
                ? -1
                : Math.min(n - 1, Math.floor(((p - FIRST) / (CLOSE - FIRST)) * n)),
            );
            pin.current?.style.setProperty('--kit-progress', p.toFixed(4));
          },
          onToggle: (self) => {
            if (!self.isActive) reset();
          },
        });
        return () => {
          trigger.current = null;
        };
      });
      mm.add('(max-width: 899px)', () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 70%',
          end: 'bottom 30%',
          onUpdate: (self) => {
            if (!self.isActive) return;
            const p = self.progress;
            kitState.explodeTarget = Math.min(1, p / 0.2, (1 - p) / 0.2);
          },
          onToggle: (self) => {
            if (!self.isActive) reset();
          },
        });
      });
      return () => {
        mm.revert();
        reset();
      };
    },
    { scope: root },
  );

  const current = KIT_ORDER[focus];
  const entry = current ? kitContent[current] : null;
  const total = String(KIT_ORDER.length).padStart(2, '0');

  /** Fait défiler jusqu'au milieu de la tranche d'une pièce. */
  const jump = (index: number): void => {
    const st = trigger.current;
    if (!st) return;
    const p = FIRST + (index + 0.5) * STEP;
    scrollToTarget(st.start + p * (st.end - st.start));
  };

  return (
    <section id="kit" className="kit" ref={root} tabIndex={-1} aria-labelledby="kit-title">
      <div
        className="kit__pin"
        ref={pin}
        data-focus={Boolean(entry)}
        style={{ ['--kit-first' as string]: FIRST, ['--kit-step' as string]: STEP }}
      >
        <header className="kit__head" data-ui>
          <p className="label">{t.kit.label}</p>
          <h2 className="kit__title" id="kit-title" ref={title}>
            {t.kit.title}
          </h2>
          <p className="kit__lead">{t.kit.lead}</p>
        </header>

        <div className="kit__panel" data-ui aria-hidden="true">
          {entry && current ? (
            <div className="kit__card" key={current}>
              <p className="kit__counter">
                <span className="kit__counter-current">{String(focus + 1).padStart(2, '0')}</span>
                <span className="kit__counter-total">/{total}</span>
              </p>
              <p className="kit__piece">
                {l(entry.piece)} <kbd>{KEY_LABEL[current]}</kbd>
              </p>
              <h3 className="kit__group">{l(entry.title)}</h3>
              <p className="kit__role">{l(entry.role)}</p>
              <ul className="kit__items">
                {entry.items.map((item) => (
                  <li key={item.fr}>{l(item)}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Barre en chapitres : un segment par groupe, cliquable pour y aller. */}
        <ol className="kit__steps" data-ui aria-hidden="true">
          {KIT_ORDER.map((id, i) => (
            <li
              key={id}
              className="kit__step"
              data-current={i === focus}
              style={{ ['--i' as string]: i }}
            >
              <button type="button" tabIndex={-1} onClick={() => jump(i)}>
                <span className="kit__step-line">
                  <span />
                </span>
                <span className="kit__step-label">
                  {String(i + 1).padStart(2, '0')} {l(kitContent[id].short)}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Liste complète : lue par les lecteurs d'écran, visible sur mobile. */}
      <ul className="kit__list" data-ui>
        {KIT_ORDER.map((id) => {
          const e = kitContent[id];
          return (
            <li className="kit__list-item" key={id}>
              <p className="kit__piece">{l(e.piece)}</p>
              <h3 className="kit__group">{l(e.title)}</h3>
              <p className="kit__role">{l(e.role)}</p>
              <ul className="kit__items">
                {e.items.map((item) => (
                  <li key={item.fr}>{l(item)}</li>
                ))}
              </ul>
              <button type="button" className="pill kit__listen" onClick={() => hit(id, 0.9)}>
                {t.kit.listen} : {l(e.piece)}
              </button>
            </li>
          );
        })}
      </ul>

      <KitTags focus={current ?? null} />
    </section>
  );
}
