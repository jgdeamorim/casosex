import { useSyncExternalStore } from 'react';
import type { DeviceFacet } from '../types';

export function resolveDeviceFacet(width: number): DeviceFacet {
  if (width < 320) return 'smartwatch';
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1920) return 'desktop';
  return 'ultrawide';
}

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getSnapshot(): DeviceFacet {
  if (typeof window === 'undefined') return 'desktop';
  return resolveDeviceFacet(window.innerWidth);
}

function getServerSnapshot(): DeviceFacet {
  return 'desktop';
}

export function useDeviceFacet(): DeviceFacet {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

