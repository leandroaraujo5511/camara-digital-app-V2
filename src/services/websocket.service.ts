import { io, Socket } from 'socket.io-client';
import { Alert } from 'react-native';

export interface WebSocketMessage {
  type: string;
  tenantId: string;
  timestamp: string;
  [key: string]: any;
}

export interface VotoMessage extends WebSocketMessage {
  type: 'voto';
  votacaoId: string;
  vereadorId: string;
  vereador: string;
  partido: string;
  voto: 'SIM' | 'NAO' | 'ABSTENCAO' | 'AUSENTE';
}

export interface StatusMessage extends WebSocketMessage {
  type: 'status';
  status: 'nenhuma' | 'aguardando_votos' | 'encerrada';
  pautaId?: string;
  titulo?: string;
  votacaoId?: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private tenantId: string | null = null;
  private token: string | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 segundo

  // Callbacks para eventos
  private onVoteUpdate: ((voto: VotoMessage) => void) | null = null;
  private onStatusUpdate: ((status: StatusMessage) => void) | null = null;
  private onConnect: (() => void) | null = null;
  private onDisconnect: (() => void) | null = null;

  // Conectar ao WebSocket
  async connect(tenantId: string, token: string, apiUrl: string) {
    if (this.socket && this.isConnected) {
      console.log('🔌 WebSocket já está conectado');
      return;
    }

    this.tenantId = tenantId;
    this.token = token;

    try {
      // Verificar se a API está acessível antes de tentar conectar
      const apiHealthy = await this.checkApiHealth();
      if (!apiHealthy) {
        console.warn('⚠️ API não está saudável, tentando conectar mesmo assim...');
      }

      // Construir URL do WebSocket
      const wsUrl = apiUrl.replace('https://', 'wss://').replace('http://', 'ws://');
      console.log('🔌 Conectando ao WebSocket:', wsUrl);
      console.log('🔌 Tenant ID:', tenantId);
      console.log('🔌 Token disponível:', !!token);

      this.socket = io(wsUrl, {
        transports: ['websocket', 'polling'], // Adicionar polling como fallback
        auth: {
          token: token
        },
        query: {
          tenantId: tenantId
        },
        timeout: 20000, // 20 segundos de timeout
        forceNew: true,
        // Adicionar configurações para melhorar a estabilidade
        reconnection: false, // Desabilitar reconexão automática do Socket.IO
        autoConnect: true
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('❌ Erro ao conectar WebSocket:', error);
      this.handleReconnect();
    }
  }

  // Configurar listeners de eventos
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ WebSocket conectado:', this.socket?.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Autenticar com o servidor
      this.authenticate();
      
      if (this.onConnect) {
        this.onConnect();
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket desconectado:', reason);
      this.isConnected = false;
      
      if (this.onDisconnect) {
        this.onDisconnect();
      }

      // Tentar reconectar se não foi desconexão intencional
      if (reason !== 'io client disconnect') {
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão WebSocket:', error);
      console.error('❌ Detalhes do erro:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      this.handleReconnect();
    });

    // Eventos específicos da aplicação
    this.socket.on('new_vote', (data: VotoMessage) => {
      console.log('🗳️ Novo voto recebido:', data);
      console.log('🗳️ Tipo:', data.type);
      console.log('🗳️ Votação ID:', data.votacaoId);
      console.log('🗳️ Vereador ID:', data.vereadorId);
      if (this.onVoteUpdate) {
        this.onVoteUpdate(data);
      }
    });

    this.socket.on('vote_updated', (data: VotoMessage) => {
      console.log('🔄 Voto atualizado recebido:', data);
      console.log('🔄 Tipo:', data.type);
      console.log('🔄 Votação ID:', data.votacaoId);
      console.log('🔄 Vereador ID:', data.vereadorId);
      if (this.onVoteUpdate) {
        this.onVoteUpdate(data);
      }
    });

    this.socket.on('painel_update', (data: WebSocketMessage) => {
      console.log('📊 Atualização do painel recebida:', data);
      
      if (data.type === 'status') {
        if (this.onStatusUpdate) {
          this.onStatusUpdate(data as StatusMessage);
        }
      } else if (data.type === 'new_vote' || data.type === 'voto') {
        if (this.onVoteUpdate) {
          this.onVoteUpdate(data as VotoMessage);
        }
      }
    });

    this.socket.on('votacao_started', (data: StatusMessage) => {
      console.log('🚀 Votação iniciada:', data);
      if (this.onStatusUpdate) {
        this.onStatusUpdate(data);
      }
    });

    this.socket.on('votacao_ended', (data: StatusMessage) => {
      console.log('🏁 Votação encerrada:', data);
      if (this.onStatusUpdate) {
        this.onStatusUpdate(data);
      }
    });
  }

  // Autenticar com o servidor
  private authenticate() {
    if (!this.socket || !this.token || !this.tenantId) return;

    console.log('🔐 Tentando autenticar WebSocket...');
    console.log('🔐 Token disponível:', !!this.token);
    console.log('🔐 Tenant ID:', this.tenantId);

    this.socket.emit('authenticate', {
      token: this.token,
      tenantId: this.tenantId
    }, (response: any) => {
      if (response && response.success) {
        console.log('✅ WebSocket autenticado com sucesso');
        
        // Entrar na sala do tenant
        console.log('🚪 Entrando na sala do tenant:', `tenant_${this.tenantId}`);
        this.socket?.emit('join_room', {
          room: `tenant_${this.tenantId}`
        });
      } else {
        console.error('❌ Falha na autenticação WebSocket:', response?.error || 'Resposta inválida');
        this.socket?.disconnect();
      }
    });
  }

  // Tentar reconectar
  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Máximo de tentativas de reconexão atingido');
      console.error('❌ Parando tentativas de reconexão automática');
      // Parar tentativas de reconexão
      this.isConnected = false;
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

    // Aumentar o delay exponencialmente para evitar spam
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);
    
    setTimeout(() => {
      if (this.tenantId && this.token && this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(`🔄 Tentando reconectar em ${delay}ms...`);
        this.connect(this.tenantId, this.token, this.getApiUrl());
      }
    }, delay);
  }

  // Método para reconectar manualmente (reset do contador)
  public async manualReconnect() {
    if (this.tenantId && this.token) {
      console.log('🔄 Reconexão manual solicitada');
      this.reconnectAttempts = 0;
      this.disconnect();
      setTimeout(async () => {
        if (this.tenantId && this.token) {
          try {
            await this.connect(this.tenantId, this.token, this.getApiUrl());
          } catch (error) {
            console.error('❌ Erro na reconexão manual:', error);
          }
        }
      }, 1000);
    }
  }

  // Obter URL da API
  private getApiUrl(): string {
    // Sempre usar a API de produção
    return 'https://api.camaradigital.cloud';
  }

  // Verificar se a API está acessível
  private async checkApiHealth(): Promise<boolean> {
    try {
      console.log('🏥 Verificando saúde da API...');
      const response = await fetch('https://api.camaradigital.cloud/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      const isHealthy = response.ok;
      console.log('🏥 API está saudável:', isHealthy, 'Status:', response.status);
      return isHealthy;
    } catch (error) {
      console.warn('⚠️ API não está acessível:', error);
      return false;
    }
  }

  // Desconectar
  disconnect() {
    if (this.socket) {
      console.log('🔌 Desconectando WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.tenantId = null;
      this.token = null;
    }
  }

  // Verificar se está conectado
  isConnectedStatus(): boolean {
    return this.isConnected;
  }

  // Reconectar manualmente (reset das tentativas)
  async reconnect() {
    console.log('🔄 Reconexão manual solicitada');
    this.reconnectAttempts = 0;
    this.disconnect();
    
    if (this.tenantId && this.token) {
      setTimeout(async () => {
        if (this.tenantId && this.token) {
          try {
            await this.connect(this.tenantId, this.token, this.getApiUrl());
          } catch (error) {
            console.error('❌ Erro na reconexão manual:', error);
          }
        }
      }, 1000);
    }
  }

  // Obter status detalhado da conexão
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
      tenantId: this.tenantId,
      hasToken: !!this.token,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }

  // Setters para callbacks
  setOnVoteUpdate(callback: (voto: VotoMessage) => void) {
    this.onVoteUpdate = callback;
  }

  setOnStatusUpdate(callback: (status: StatusMessage) => void) {
    this.onStatusUpdate = callback;
  }

  setOnConnect(callback: () => void) {
    this.onConnect = callback;
  }

  setOnDisconnect(callback: () => void) {
    this.onDisconnect = callback;
  }

  // Emitir evento personalizado (se necessário)
  emit(event: string, data: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ WebSocket não está conectado');
    }
  }
}

// Instância singleton
export const websocketService = new WebSocketService();
export default websocketService;
