'use client';

import React, { useSyncExternalStore } from 'react';
import screensSeed from '../seeds/responsive-screens.json';

export type ScreenModel = 'smartwatch' | 'mobile' | 'tablet' | 'desktop' | 'ultra-screen';

export interface ResponsiveViewportEngineProps {
  children: (currentModel: ScreenModel) => React.ReactNode;
}

function getSnapshot(): ScreenModel {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 360) return 'smartwatch';
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  if (w < 1920) return 'desktop';
  return 'ultra-screen';
}

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => { void 0; };
  window.addEventListener('resize', callback);
  return () => {
    window.removeEventListener('resize', callback);
  };
}

export function ResponsiveViewportEngine({ children }: ResponsiveViewportEngineProps): React.JSX.Element {
  const activeModel = useSyncExternalStore(subscribe, getSnapshot, () => 'desktop');

  const modelConfig = screensSeed.screens.find(s => s.model === activeModel) || screensSeed.screens[3];

  return (
    <div 
      data-screen-model={activeModel}
      data-layout-mode={modelConfig.layout_mode}
      className="w-full h-full min-h-screen bg-slate-950 text-slate-100 transition-colors duration-200"
    >
      {children(activeModel as ScreenModel)}
    </div>
  );
}
