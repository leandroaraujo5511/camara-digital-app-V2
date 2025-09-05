export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tenantId?: string;
  role?: string;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  status: 'active' | 'inactive';
  description?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  city: string;
  state: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vereador {
  id: string;
  name: string;
  email: string;
  phone: string;
  legislature: string;
  mandate: string;
  position: string;
  status: string;
  profilePhoto?: string;
  tenantId: string;
  party: {
    id: string;
    acronym: string;
    name: string;
    color: string;
  };
}

export interface LoginResponse {
  token: string;
  user: User;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Pauta {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  type: 'ORDINARY' | 'EXTRAORDINARY' | 'SPECIAL' | 'URGENT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  commission: string;
  proponent: string;
  number: string;
  year: string;
  sessionDate: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'READY_FOR_VOTING' | 'REJECTED' | 'ARCHIVED';
  observations?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
  tenant: Tenant;
}

export interface Votacao {
  id: string;
  tenantId: string;
  pautaId: string;
  title: string;
  description: string;
  type: string;
  number: string;
  year: string;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
  pauta: Pauta;
}

export interface Vote {
  id: string;
  tenantId: string;
  votacaoId: string;
  vereadorId: string;
  vote: 'SIM' | 'NAO' | 'ABSTENCAO' | 'AUSENTE';
  createdAt: string;
  vereador: Vereador;
  votacao: Votacao;
}

export interface VotacaoStats {
  total: number;
  sim: number;
  nao: number;
  abstencao: number;
  ausente: number;
  percentualSim: number;
  percentualNao: number;
}
