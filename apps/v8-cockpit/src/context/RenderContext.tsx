import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Supplier, UserSession, UserRole, HomologationStatus } from '../types';

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
  updateSupplierStatus: (supplierId: string, status: HomologationStatus) => void;
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

  useEffect(() => {
    async function loadSuppliers(): Promise<void> {
      try {
        const resp = await fetch('/suppliers.json');
        if (resp.ok) {
          const data: Supplier[] = await resp.json();
          setSuppliers(data);
          if (data.length > 0) {
            setSelectedSupplier(data[0]);
          }
        }
      } catch (e: unknown) {
        void e;
      }
    }
    void loadSuppliers();
  }, []);

  const setUserRole = (role: UserRole): void => {
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
  };

  const selectSupplier = (sup: Supplier | null): void => {
    setSelectedSupplier(sup);
  };

  const toggleChat = (): void => {
    setIsChatOpen(prev => !prev);
    setUnreadCount(0);
  };

  const clearUnread = (): void => {
    setUnreadCount(0);
  };

  const updateSupplierStatus = (supplierId: string, status: HomologationStatus): void => {
    setSuppliers(prev => prev.map(s => s.id === supplierId ? { ...s, status } : s));
    if (selectedSupplier && selectedSupplier.id === supplierId) {
      setSelectedSupplier(prev => prev ? { ...prev, status } : null);
    }
  };

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
        updateSupplierStatus
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
