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
  unreadCount: number;
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
  email: 'jeferson@volupia.com.br',
  scopePermissions: ['all', 'admin', 'homologation', 'quotes', 'chat']
};

const RenderContext = createContext<RenderContextType | undefined>(undefined);

export function RenderContextProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [userSession, setUserSession] = useState<UserSession>(defaultSession);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedPolo, setSelectedPolo] = useState<'TODOS' | 'SP' | 'RJ'>('TODOS');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(3);

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
      const resp = await fetch('/suppliers.json');
      if (!resp.ok) {
        throw new Error(`Falha ao carregar catálogo (HTTP ${resp.status})`);
      }
      const data: Supplier[] = await resp.json();

      // Overrides de status são deltas sobre o catálogo estático — falha aqui não
      // bloqueia a tela, apenas deixa os status no valor do arquivo.
      let overrides: Record<string, HomologationStatus> = {};
      try {
        overrides = await fetchStatusOverrides();
      } catch {
        overrides = {};
      }

      const merged = data.map(s => ({
        ...s,
        status: (overrides[s.id] ?? s.status) as HomologationStatus
      }));
      setSuppliers(merged);
      if (merged.length > 0) {
        setSelectedSupplier(prev => prev ?? merged[0]);
      }
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : 'Erro inesperado ao carregar dados.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const setUserRole = useCallback((role: UserRole): void => {
    if (role === 'founder') {
      setUserSession({
        id: 'usr_1',
        name: 'Jeferson Amorim',
        role: 'founder',
        avatar: 'JA',
        email: 'jeferson@volupia.com.br',
        scopePermissions: ['all', 'admin', 'homologation', 'quotes', 'chat']
      });
    } else if (role === 'ops') {
      setUserSession({
        id: 'usr_2',
        name: 'Gláucia Michaella',
        role: 'ops',
        avatar: 'GM',
        email: 'glaucia@volupia.com.br',
        scopePermissions: ['homologation', 'chat']
      });
    } else {
      setUserSession({
        id: 'usr_3',
        name: 'Bruno Amin',
        role: 'commercial',
        avatar: 'BA',
        email: 'bruno@volupia.com.br',
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
      const previous: Supplier[] = suppliers;
      setStatusSaving(true);
      setStatusError(null);

      setSuppliers(prev => prev.map(s => (s.id === supplierId ? { ...s, status } : s)));
      setSelectedSupplier(prev => (prev && prev.id === supplierId ? { ...prev, status } : prev));

      void patchSupplierStatus(supplierId, status, userSession.name)
        .catch(() => {
          setSuppliers(previous);
          setSelectedSupplier(prev =>
            prev && prev.id === supplierId
              ? { ...prev, status: previous.find(s => s.id === supplierId)?.status ?? prev.status }
              : prev
          );
          setStatusError('Não foi possível salvar o status no Cloudflare D1. Revertido.');
        })
        .finally(() => setStatusSaving(false));
    },
    [suppliers, userSession.name]
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

  const toggleChat = useCallback((): void => {
    setIsChatOpen(prev => {
      const next = !prev;
      if (next) setUnreadCount(0);
      return next;
    });
  }, []);

  const clearUnread = useCallback((): void => {
    setUnreadCount(0);
  }, []);

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
        unreadCount,
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
