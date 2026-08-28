'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Supplier,
  UserSession,
  UserRole,
  HomologationStatus,
  HomologationDossier
} from '../types';
import {
  fetchStatusOverrides,
  patchSupplierStatus,
  fetchDossier,
  putDossier,
  getLocalStatusOverrides,
  saveLocalStatusOverride,
  enqueuePendingSync,
  removeFromPendingSync,
  flushPendingSyncQueue,
  type DossierInput
} from '../lib/api';

interface RenderContextType {
  userSession: UserSession;
  setUserRole: (role: UserRole) => void;
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  selectSupplier: (sup: Supplier | null) => void;
  selectedPolo: 'TODOS' | 'SP' | 'RJ';
  setSelectedPolo: (polo: 'TODOS' | 'SP' | 'RJ') => void;
  isChatOpen: boolean;
  toggleChat: () => void;
  isProfileOpen: boolean;
  toggleProfile: () => void;
  unreadCount: number;
  unreadByChannel: Record<string, number>;
  clearChannelUnread: (channel: string) => void;
  clearUnread: () => void;
  isLoading: boolean;
  loadError: string | null;
  retry: () => void;
  statusSaving: boolean;
  statusError: string | null;
  updateSupplierStatus: (supplierId: string, status: HomologationStatus) => void;
  currentDossier: HomologationDossier | null;
  dossierLoading: boolean;
  dossierError: string | null;
  saveDossier: (input: DossierInput) => Promise<boolean>;
}

  const defaultSession: UserSession = {
  id: 'usr_1',
  name: 'Jeferson Amorim',
  role: 'founder',
  avatar: 'JA',
  email: 'jeferson@usevolupia.com.br',
  scopePermissions: ['all', 'admin', 'homologation', 'quotes', 'chat']
};

const RenderContext = createContext<RenderContextType | undefined>(undefined);

export function RenderContextProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [userSession, setUserSession] = useState<UserSession>(defaultSession);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedPolo, setSelectedPolo] = useState<'TODOS' | 'SP' | 'RJ'>('TODOS');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [unreadByChannel, setUnreadByChannel] = useState<Record<string, number>>({
    '#geral-volupia': 1,
    '#homologacao-glaucia': 1,
    '#negociacao-bruno': 1
  });

  const unreadCount = Object.values(unreadByChannel).reduce((acc, val) => acc + val, 0);

  const clearChannelUnread = useCallback((channel: string): void => {
    setUnreadByChannel(prev => {
      if (!prev[channel]) return prev;
      return { ...prev, [channel]: 0 };
    });
  }, []);

  const clearUnread = useCallback((): void => {
    setUnreadByChannel({
      '#geral-volupia': 0,
      '#homologacao-glaucia': 0,
      '#negociacao-bruno': 0
    });
  }, []);

  const toggleChat = useCallback((): void => {
    setIsChatOpen(prev => !prev);
  }, []);

  const toggleProfile = useCallback((): void => {
    setIsProfileOpen(prev => !prev);
  }, []);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusSaving, setStatusSaving] = useState<boolean>(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [currentDossier, setCurrentDossier] = useState<HomologationDossier | null>(null);
  const [dossierLoading, setDossierLoading] = useState<boolean>(false);
  const [dossierError, setDossierError] = useState<string | null>(null);

  const loadData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const resp = await fetch('/api/v8/suppliers');
      if (!resp.ok) {
        throw new Error(`Falha ao carregar catálogo (HTTP ${resp.status})`);
      }
      const data: Supplier[] = await resp.json();

      // Carrega overrides do D1 e mescla com overrides salvos localmente (PWA Offline First)
      let remoteOverrides: Record<string, HomologationStatus> = {};
      try {
        remoteOverrides = await fetchStatusOverrides();
      } catch {
        remoteOverrides = {};
      }

      const localOverrides = getLocalStatusOverrides();
      const combinedOverrides = { ...localOverrides, ...remoteOverrides };

      const merged = data.map(s => ({
        ...s,
        status: (combinedOverrides[s.id] ?? s.status) as HomologationStatus
      }));
      setSuppliers(merged);
      if (merged.length > 0) {
        const defaultSelected = merged.find(s => s.status === 'VISITA_PENDENTE') ?? merged[0];
        setSelectedSupplier(prev => prev ?? defaultSelected);
      }

      // Sincroniza pendências acumuladas em segundo plano se a API responder
      void flushPendingSyncQueue();
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : 'Erro inesperado ao carregar dados.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();

    const handleOnline = (): void => {
      void flushPendingSyncQueue().then((synced) => {
        if (synced > 0) {
          void loadData();
        }
      });
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [loadData]);

  const setUserRole = useCallback((role: UserRole): void => {
    if (role === 'founder') {
      setUserSession({
        id: 'usr_1',
        name: 'Jeferson Amorim',
        role: 'founder',
        avatar: 'JA',
        email: 'jeferson@usevolupia.com.br',
        scopePermissions: ['all', 'admin', 'homologation', 'quotes', 'chat']
      });
    } else if (role === 'ops') {
      setUserSession({
        id: 'usr_2',
        name: 'Gláucia Michaella',
        role: 'ops',
        avatar: 'GM',
        email: 'glaucia@usevolupia.com.br',
        scopePermissions: ['homologation', 'chat']
      });
    } else {
      setUserSession({
        id: 'usr_3',
        name: 'Bruno Amin',
        role: 'commercial',
        avatar: 'BA',
        email: 'bruno@usevolupia.com.br',
        scopePermissions: ['quotes', 'chat']
      });
    }
  }, []);

  const loadDossier = useCallback(async (supplierId: string): Promise<void> => {
    setDossierLoading(true);
    setDossierError(null);
    try {
      const dossier = await fetchDossier(supplierId);
      setCurrentDossier(dossier);
    } catch (e: unknown) {
      setDossierError(e instanceof Error ? e.message : 'Falha ao carregar dossiê.');
      setCurrentDossier(null);
    } finally {
      setDossierLoading(false);
    }
  }, []);

  const selectSupplier = useCallback(
    (sup: Supplier | null): void => {
      setSelectedSupplier(sup);
      setCurrentDossier(null);
      if (sup) {
        void loadDossier(sup.id);
      }
    },
    [loadDossier]
  );

  const updateSupplierStatus = useCallback(
    (supplierId: string, status: HomologationStatus): void => {
      setStatusSaving(true);
      setStatusError(null);

      // 1. Atualização OTIMISTA imediata no React State
      setSuppliers(prev => prev.map(s => (s.id === supplierId ? { ...s, status } : s)));
      setSelectedSupplier(prev => (prev && prev.id === supplierId ? { ...prev, status } : prev));

      // 2. Persistência imediata em LocalStorage (PWA Cache Local)
      saveLocalStatusOverride(supplierId, status);

      // 3. Sincronização em segundo plano com Cloudflare D1 Worker
      void patchSupplierStatus(supplierId, status, userSession.name)
        .then(() => {
          removeFromPendingSync(supplierId);
        })
        .catch(() => {
          // Se a API estiver inacessível (offline ou dev local sem Worker D1), NÃO reverte!
          // Registra na fila de sincronização para tentar novamente ao reconectar.
          enqueuePendingSync(supplierId, status, userSession.name);
          setStatusError('Status mantido localmente. Será sincronizado com o D1 ao conectar.');
        })
        .finally(() => setStatusSaving(false));
    },
    [userSession.name]
  );

  const saveDossier = useCallback(
    async (input: DossierInput): Promise<boolean> => {
      setDossierError(null);
      try {
        const saved = await putDossier(input);
        setCurrentDossier(saved);
        return true;
      } catch (e: unknown) {
        setDossierError(e instanceof Error ? e.message : 'Falha ao salvar dossiê.');
        return false;
      }
    },
    []
  );

  return (
    <RenderContext.Provider
      value={{
        userSession,
        setUserRole,
        suppliers,
        selectedSupplier,
        selectSupplier,
        selectedPolo,
        setSelectedPolo,
        isChatOpen,
        toggleChat,
        isProfileOpen,
        toggleProfile,
        unreadCount,
        unreadByChannel,
        clearChannelUnread,
        clearUnread,
        isLoading,
        loadError,
        retry: loadData,
        statusSaving,
        statusError,
        updateSupplierStatus,
        currentDossier,
        dossierLoading,
        dossierError,
        saveDossier
      }}
    >
      {children}
    </RenderContext.Provider>
  );
}

export function useRenderContext(): RenderContextType {
  const context = useContext(RenderContext);
  if (!context) {
    throw new Error('useRenderContext must be used within RenderContextProvider');
  }
  return context;
}
