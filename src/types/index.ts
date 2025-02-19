export * from './user';
export * from './auth';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatar_url: string | null;
  username?: string;
  bio?: string;
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

