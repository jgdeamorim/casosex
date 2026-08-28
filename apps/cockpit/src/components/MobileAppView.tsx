import React, { useState } from 'react';
import { MobileHeader } from './layout/MobileHeader';
import { BottomGlassDock } from './layout/BottomGlassDock';
import { MobileIntelView } from './dashboard/MobileIntelView';
import { MobileSupplierCards } from './suppliers/MobileSupplierCards';
import { MobileDossierView } from './dossier/MobileDossierView';
import { TeamChatDrawer } from './chat/TeamChatDrawer';
import { UserProfileModal } from './profile/UserProfileModal';

interface MobileAppViewProps {
  onLogout?: () => void;
}

export function MobileAppView({ onLogout }: MobileAppViewProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <div className="min-h-screen bg-[#0c0a0b] text-[#faf7f5] flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* 1. Shell Header Fixo no Topo com Logo e Avatar */}
      <MobileHeader />

      {/* 2. Conteúdo Principal Dinâmico por Aba (Intel | Dossiê | Polos) */}
      <main className="flex-1 px-4 pt-4 pb-24 max-w-md mx-auto w-full space-y-4">
        {activeTab === 'dashboard' && <MobileIntelView />}
        {activeTab === 'dossier' && <MobileDossierView />}
        {activeTab === 'suppliers' && <MobileSupplierCards />}
      </main>

      {/* 3. Modal de Perfil Soberano do Operador */}
      <UserProfileModal onLogout={onLogout} />

      {/* 4. Interchat Team B2B (Overlay Modo Preservativo de Navigation) */}
      <TeamChatDrawer />

      {/* 5. Dock de Navegação de Vidro Apple 2026+ no Rodapé */}
      <BottomGlassDock activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
