import { useState, useEffect } from 'react';
import type { DeviceFacet } from '../types';

export function resolveDeviceFacet(width: number): DeviceFacet {
  if (width < 320) return 'smartwatch';
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1920) return 'desktop';
  return 'ultrawide';
}

export function useDeviceFacet(): DeviceFacet {
  const [facet, setFacet] = useState<DeviceFacet>(() => {
    if (typeof window !== 'undefined') {
      return resolveDeviceFacet(window.innerWidth);
    }
    return 'desktop';
  });

  useEffect(() => {
    function handleResize(): void {
      setFacet(resolveDeviceFacet(window.innerWidth));
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return facet;
}
