/**
 * dct-motion Enterprise Engine (ADR-0081)
 * Zero-dependency spring interpolation and FLIP layout morphing engine.
 */

export interface ElementRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function captureElementRect(element: HTMLElement): ElementRect {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height
  };
}

export function animateFlipMorph(
  element: HTMLElement,
  firstRect: ElementRect,
  durationMs: number = 300
): void {
  const lastRect = captureElementRect(element);

  const deltaX = firstRect.left - lastRect.left;
  const deltaY = firstRect.top - lastRect.top;
  const deltaW = firstRect.width / Math.max(1, lastRect.width);
  const deltaH = firstRect.height / Math.max(1, lastRect.height);

  element.style.transformOrigin = 'top left';
  element.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${deltaW}, ${deltaH})`;
  element.style.transition = 'none';

  requestAnimationFrame(() => {
    element.style.transition = `transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    element.style.transform = 'none';
  });
}
