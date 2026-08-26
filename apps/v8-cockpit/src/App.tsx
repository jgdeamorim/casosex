'use client';

import React, { useState, useEffect } from 'react';
import { RenderContextProvider, useRenderContext } from './context/RenderContext';
import { useDeviceFacet } from './facets/DeviceLayoutFacet';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomGlassDock } from './components/layout/BottomGlassDock';
import { KPIGrid } from './components/kpi/KPIGrid';
import { SupplierMap } from './components/map/SupplierMap';
import { HomologationForm } from './components/dossier/HomologationForm';
import { SupplierTable } from './components/suppliers/SupplierTable';
import { TeamChatDrawer } from './components/chat/TeamChatDrawer';
import { ScopeGuard } from './auth/ScopeGuard';
import { LoginView } from './components/auth/LoginView';

function MainLayout(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const facet = useDeviceFacet();
  const { userSession } = useRenderContext();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('/login')) {
      setActiveTab('login');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0a0b] text-[#faf7f5] flex flex-col pb-20 md:pb-0">
      <Header />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Smartwatch Mini Facet Alert */}
          {facet === 'smartwatch' && (
            <div className="p-3 rounded-xl bg-[#e11d48]/20 border border-[#e11d48]/40 text-center text-xs font-bold text-[#faf7f5]">
              ⌚ Modo Smartwatch 1x1 Widget Ativo ({userSession.name})
            </div>
          )}

          {/* Main Dashboard / Bento Grid Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <KPIGrid />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ScopeGuard tabName="map">
                    <SupplierMap />
                  </ScopeGuard>
                </div>
                <div className="lg:col-span-1">
                  <ScopeGuard tabName="dossier">
                    <HomologationForm />
                  </ScopeGuard>
                </div>
              </div>

              <ScopeGuard tabName="suppliers">
                <SupplierTable />
              </ScopeGuard>
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

          {/* Suppliers Table Tab */}
          {activeTab === 'suppliers' && (
            <ScopeGuard tabName="suppliers">
              <SupplierTable />
            </ScopeGuard>
          )}

          {/* Dedicated Login Portal Tab */}
          {activeTab === 'login' && (
            <LoginView onSuccess={() => setActiveTab('dashboard')} />
          )}
        </main>
      </div>

      <BottomGlassDock activeTab={activeTab} setActiveTab={setActiveTab} />
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

export default App;
