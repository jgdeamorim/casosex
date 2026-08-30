import React, { useState, useEffect } from 'react';
import { RenderContextProvider, useRenderContext } from './context/RenderContext';
import { useDeviceFacet } from './facets/DeviceLayoutFacet';
import { Header } from './components/layout/Header';
import { MobileAppView } from './components/MobileAppView';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { Sidebar } from './components/layout/Sidebar';
import { BottomGlassDock } from './components/layout/BottomGlassDock';
import { KPIGrid } from './components/kpi/KPIGrid';
import { SupplierMap } from './components/map/SupplierMap';
import { HomologationForm } from './components/dossier/HomologationForm';
import { SupplierTable } from './components/suppliers/SupplierTable';
import { MobileSupplierCards } from './components/suppliers/MobileSupplierCards';
import { TeamChatDrawer } from './components/chat/TeamChatDrawer';
import { ScopeGuard } from './auth/ScopeGuard';
import { LoginView } from './components/auth/LoginView';
import { AgendaPage } from './components/agenda/AgendaPage';
import { BrandDnaPage } from './components/dna/BrandDnaPage';
import { CharacterLibraryPage } from './components/dna/CharacterLibraryPage';

function hasActiveSession(): boolean {
  if (typeof window === 'undefined') return false;
  const search = window.location.search.toLowerCase();
  if (search.includes('sso_success=true')) return true;
  try {
    const stored = localStorage.getItem('v8_active_session');
    if (stored) {
      const parsed = JSON.parse(stored) as { email?: string };
      if (parsed && parsed.email) return true;
    }
  } catch (e: unknown) { void e; }
  return false;
}

function getTabFromUrl(): string {
  if (typeof window === 'undefined') return 'login';
  const path = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();

  if (search.includes('sso_success=true')) {
    return 'agenda';
  }

  if (path.includes('/login') || path.includes('/sso') || path.includes('/auth') || (search.includes('login') && !search.includes('sso_success'))) {
    return 'login';
  }

  if (!hasActiveSession()) {
    return 'login';
  }

  if (path.includes('/agenda')) return 'agenda';
  if (path.includes('/map')) return 'map';
  if (path.includes('/dossier')) return 'dossier';
  if (path.includes('/suppliers')) return 'suppliers';
  return 'agenda';
}

function MainLayout(): React.ReactElement {
  const [activeTab, setActiveTabState] = useState<string>(getTabFromUrl);
  const facet = useDeviceFacet();
  const { userSession } = useRenderContext();

  const handleTabChange = (tab: string) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const newPath = tab === 'agenda' ? '/' : `/${tab}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(getTabFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('v8_theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light-theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (savedTheme === 'dark') {
      document.documentElement.classList.remove('light-theme', 'light');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const isMobileView = facet === 'mobile' || facet === 'smartwatch';

  if (activeTab === 'login') {
    return <LoginView onSuccess={() => handleTabChange('agenda')} />;
  }

  if (isMobileView) {
    return <MobileAppView onLogout={() => handleTabChange('login')} />;
  }

  return (
    <div className="min-h-screen bg-[#0c0a0b] text-[#faf7f5] flex flex-col pb-20 md:pb-0">
      {/* Dynamic Shell Header (Desktop Header) */}
      <Header onLogout={() => handleTabChange('login')} />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Agenda IA Tab (Content OS Core) */}
          {activeTab === 'agenda' && (
            <ScopeGuard tabName="agenda">
              <AgendaPage userRole={userSession.role} />
            </ScopeGuard>
          )}

          {/* Brand DNA Tab */}
          {activeTab === 'brand_dna' && (
            <ScopeGuard tabName="brand_dna">
              <BrandDnaPage />
            </ScopeGuard>
          )}

          {/* Character Library Tab */}
          {activeTab === 'characters' && (
            <ScopeGuard tabName="characters">
              <CharacterLibraryPage />
            </ScopeGuard>
          )}

          {/* Main Dashboard / Bento Grid Tab (Market Intel) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* 1. 4 KPI Cards Grid */}
              <KPIGrid />

              {/* 2. 1 Coluna - Mapa de ponta a ponta (Left to Right) */}
              <ScopeGuard tabName="map">
                <SupplierMap />
              </ScopeGuard>

              {/* 3. 2 Colunas no Desktop | Stack Vertical no Mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <ScopeGuard tabName="dossier">
                  <HomologationForm />
                </ScopeGuard>
                <ScopeGuard tabName="suppliers">
                  {isMobileView ? <MobileSupplierCards /> : <SupplierTable />}
                </ScopeGuard>
              </div>
            </div>
          )}

          {/* Map Tab */}
          {activeTab === 'map' && (
            <ScopeGuard tabName="map">
              <SupplierMap />
            </ScopeGuard>
          )}

          {/* Dossier Tab */}
          {activeTab === 'dossier' && (
            <ScopeGuard tabName="dossier">
              <HomologationForm />
            </ScopeGuard>
          )}

          {/* Suppliers Table / Cards Tab */}
          {activeTab === 'suppliers' && (
            <ScopeGuard tabName="suppliers">
              {isMobileView ? <MobileSupplierCards /> : <SupplierTable />}
            </ScopeGuard>
          )}
        </main>
      </div>

      <BottomGlassDock activeTab={activeTab} setActiveTab={handleTabChange} />
      <UserProfileModal onLogout={() => handleTabChange('login')} />
      <TeamChatDrawer />
    </div>
  );
}

export function App(): React.ReactElement {
  return (
    <RenderContextProvider>
      <MainLayout />
    </RenderContextProvider>
  );
}
