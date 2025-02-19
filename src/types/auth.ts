import type { Usuario } from './index';

export interface SignUpData {
  email: string;
  password: string;
  nome: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Usuario | null;
  error: Error | null;
} 