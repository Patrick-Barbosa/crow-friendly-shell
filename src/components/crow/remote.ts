import { useEffect } from 'react';

export function remoteElements(scope: ParentNode = document) {
  return Array.from(scope.querySelectorAll<HTMLElement>('[data-remote]')).filter(el => !el.hasAttribute('disabled') && el.getClientRects().length > 0);
}

export function focusRemote(id?: string) {
  const all = remoteElements();
  const target = all.find(el => el.dataset['remote'] === id) ?? all.find(el => el.hasAttribute('data-initial-focus')) ?? all.find(el => !el.closest('aside')) ?? all[0];
  target?.focus({ preventScroll: true });
  target?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
}

export function useRemote(onBack: () => void) {
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key === 'Escape' || event.key === 'Backspace' && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault(); onBack(); return;
      }
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      if (event.target instanceof HTMLSelectElement || event.target instanceof HTMLInputElement && ['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const modal = document.querySelector('[data-remote-modal]');
      const elements = remoteElements(modal ?? document);
      const current = document.activeElement as HTMLElement | null;
      if (!current || !elements.includes(current)) { event.preventDefault(); focusRemote(); return; }
      const rect = current.getBoundingClientRect();
      const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
      const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
      const sign = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
      let best: HTMLElement | undefined, score = Infinity;
      elements.forEach(el => {
        if (el === current) return;
        const r = el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - x, dy = r.top + r.height / 2 - y;
        const primary = horizontal ? dx : dy, cross = horizontal ? dy : dx;
        if (primary * sign < 8) return;
        if (current.closest('aside') && !horizontal && !el.closest('aside')) return;
        const candidate = Math.abs(primary) + Math.abs(cross) * 3;
        if (candidate < score) { score = candidate; best = el; }
      });
      event.preventDefault();
      best?.focus({ preventScroll: true });
      best?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [onBack]);
}