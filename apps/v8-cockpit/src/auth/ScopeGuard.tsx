import React from 'react';
import { useRenderContext } from '../context/RenderContext';
import { canAccessTab } from './userRules';

type ScopeGuardProps = {
  tabName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function ScopeGuard({ tabName, children, fallback }: ScopeGuardProps): React.ReactElement | null {
  const { userSession } = useRenderContext();
  const hasAccess = canAccessTab(userSession.role, tabName);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="p-6 rounded-xl bg-[#161214] border border-[#e11d48]/20 text-center">
        <p className="text-[#a39b94] text-sm">
          Acesso restrito ao perfil <strong className="text-[#faf7f5]">{userSession.name}</strong> ({userSession.role.toUpperCase()}).
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
