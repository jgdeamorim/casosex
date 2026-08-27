import React, { useState, useEffect } from 'react';
import { RenderContextProvider } from './context/RenderContext';
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

function MainLayout(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const facet = useDeviceFacet();

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

  if (isMobileView) {
    return <MobileAppView />;
  }

  return (
    <div className="min-h-screen bg-[#0c0a0b] text-[#faf7f5] flex flex-col pb-20 md:pb-0">
      {/* Dynamic Shell Header (Desktop Header) */}
      <Header />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
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

          {/* Dedicated Login Portal Tab */}
          {activeTab === 'login' && (
            <LoginView onSuccess={() => setActiveTab('dashboard')} />
          )}
        </main>
      </div>

      <BottomGlassDock activeTab={activeTab} setActiveTab={setActiveTab} />
      <UserProfileModal />
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
