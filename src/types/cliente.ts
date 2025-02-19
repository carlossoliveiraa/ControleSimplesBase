export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  sexo: 'M' | 'F' | 'O';
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  observacoes: string | null;
  ativo: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClienteFormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  sexo: 'M' | 'F' | 'O';
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  observacoes?: string;
  ativo: boolean;
  avatar_url: string | null;
} 