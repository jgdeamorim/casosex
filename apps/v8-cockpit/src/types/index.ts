export type UserRole = 'founder' | 'ops' | 'commercial';

export interface UserSession {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email: string;
  scopePermissions: string[];
}

export type HomologationStatus = 'HOMOLOGADO' | 'VISITA_PENDENTE' | 'PROSPECCAO' | 'REJEITADO';

export interface Supplier {
  id: string;
  place_id?: string;
  name: string;
  category: string;
  city: string;
  state: string;
  address?: string;
  cnpj?: string;
  status: HomologationStatus;
  whatsapp?: string;
  phone?: string;
  latitude: number;
  longitude: number;
  lat?: number;
  lng?: number;
  gmb_url?: string;
  gmb?: string;
  rating?: number;
  quality_score?: number;
}

export interface HomologationDossier {
  supplierId: string;
  supplierName: string;
  qualityScore: number;
  anvisaBodySafe: boolean;
  moq: string;
  paymentTerms: string;
  catalogUrl?: string;
  catalogFileName?: string;
  auditNotes: string;
  status: HomologationStatus;
  auditorName: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  channel: '#geral-volupia' | '#homologacao-glaucia' | '#negociacao-bruno';
  author: string;
  time: string;
  text: string;
  isMe?: boolean;
}

export type DeviceFacet = 'smartwatch' | 'mobile' | 'tablet' | 'desktop' | 'ultrawide';
