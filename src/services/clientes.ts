import { supabase } from '../lib/supabase';
import type { Cliente, ClienteFormData } from '../types';

class ClienteService {
  private static instance: ClienteService;

  private constructor() {}

  static getInstance(): ClienteService {
    if (!ClienteService.instance) {
      ClienteService.instance = new ClienteService();
    }
    return ClienteService.instance;
  }

  async criar(data: ClienteFormData): Promise<{ data: Cliente | null; error: Error | null }> {
    try {
      const { data: cliente, error } = await supabase
        .from('clientes')
        .insert([{ ...data, created_at: new Date().toISOString() }])
        .select('*')
        .single();

      if (error) throw error;

      return { data: cliente, error: null };
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error);
      return { data: null, error: new Error(error.message) };
    }
  }

  async atualizar(id: string, data: ClienteFormData): Promise<{ data: Cliente | null; error: Error | null }> {
    try {
      const { data: cliente, error } = await supabase
        .from('clientes')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      return { data: cliente, error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar cliente:', error);
      return { data: null, error: new Error(error.message) };
    }
  }

  async listar(): Promise<{ data: Cliente[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome');

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      console.error('Erro ao listar clientes:', error);
      return { data: null, error: new Error(error.message) };
    }
  }
}

export const clienteService = ClienteService.getInstance(); 