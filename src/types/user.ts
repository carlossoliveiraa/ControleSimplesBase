export interface User {
  id: string;
  email: string;
  nome: string;
  avatar_url: string | null;
  telefone: string | null;
  data_nascimento: string | null;
  status: 'online' | 'offline';
  ultimo_acesso: string | null;
  created_at: string;
  updated_at: string;
  configuracoes: {
    tema: 'light' | 'dark';
    idioma: string;
  };
}

export interface UserUpdateDTO {
  nome?: string;
  telefone?: string;
  data_nascimento?: string;
  avatar_url?: string | null;
  configuracoes?: {
    tema: 'light' | 'dark';
    idioma: string;
  };
}

export interface AuthResponse {
  user: User | null;
  error: Error | null;
} 