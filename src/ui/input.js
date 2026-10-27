import { GAP, LAST, STOPS } from '../config.js';
import { isTouch } from '../scene/stage.js';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function bindInput(state, ui) {
  function walk(distance) {
    if (ui.isModalOpen()) return;
    state.target = clamp(state.target + distance, 0, LAST);
    state.idle = 0;
    ui.hideHint();
  }

  function jump(stop) {
    state.target = clamp(stop, 0, STOPS - 1) * GAP;
    state.idle = 0;
    ui.hideHint();
  }

  addEventListener('wheel', (e) => {
    const card = e.target.closest && e.target.closest('.card');
    if (card && card.scrollHeight > card.clientHeight + 2) return;
    walk((e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY) * 0.035);
  }, { passive: true });

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') ui.closeModal();
    if (ui.isModalOpen()) return;
    const here = Math.round(state.target / GAP);
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); jump(here + 1); }
    if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); jump(here - 1); }
    if (e.key === 'Home') jump(0);
    if (e.key === 'End') jump(STOPS - 1);
  });

  let touchY = null;
  addEventListener('touchstart', (e) => {
    const card = e.target.closest('.card');
    const scrollable = card && card.scrollHeight > card.clientHeight + 2;
    touchY = e.target.closest('#modal') || scrollable ? null : e.touches[0].clientY;
  }, { passive: true });
  addEventListener('touchmove', (e) => {
    if (touchY === null) return;
    const y = e.touches[0].clientY;
    walk((touchY - y) * 0.09);
    touchY = y;
  }, { passive: true });

  if (!isTouch) {
    addEventListener('pointermove', (e) => {
      state.pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
      state.pointerMoved = true;
      ui.moveTip(e.clientX, e.clientY);
    });
  }
}
