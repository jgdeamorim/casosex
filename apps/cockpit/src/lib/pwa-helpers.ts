/**
 * PWA & Mobile Native Helpers for V8 Cockpit
 * SOP & SWC Compliant - Fail-soft & Type Safe
 */

export function triggerHapticFeedback(pattern: number | number[] = 10): void {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e: unknown) {
      void e;
    }
  }
}

export function toggleFullscreen(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);

  return new Promise((resolve) => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement
          .requestFullscreen()
          .then(() => resolve(true))
          .catch(() => resolve(false));
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
            .then(() => resolve(false))
            .catch(() => resolve(false));
        } else {
          resolve(false);
        }
      }
    } catch (e: unknown) {
      void e;
      resolve(false);
    }
  });
}

export function setupGPUStandbyListener(onVisibilityChange?: (isVisible: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleVisibilityChange = (): void => {
    const isVisible = document.visibilityState === 'visible';
    if (onVisibilityChange) {
      onVisibilityChange(isVisible);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
