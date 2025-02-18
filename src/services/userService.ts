import { supabase } from '../lib/supabase';
import { User, UserUpdateDTO, AuthResponse } from '../types/user';

export class UserService {
  private static instance: UserService;

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async updateProfile(userId: string, data: UserUpdateDTO): Promise<AuthResponse> {
    try {
      // Buscar perfil atual primeiro
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!currentProfile) {
        throw new Error('Perfil não encontrado');
      }

      // Mesclar dados atuais com as atualizações
      const updatedData = {
        ...currentProfile,
        ...data,
        updated_at: new Date().toISOString()
      };

      const { data: profile, error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', userId)
        .select('*')
        .single();

      if (error) throw error;

      return { user: profile, error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      return { 
        user: null, 
        error: new Error(error.message || 'Erro ao atualizar perfil')
      };
    }
  }

  async updateAvatar(userId: string, file: File): Promise<AuthResponse> {
    try {
      // Buscar perfil atual
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!currentProfile) {
        throw new Error('Perfil não encontrado');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '0',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Gerar URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Atualizar perfil mantendo dados existentes
      const { data: profile, error } = await supabase
        .from('profiles')
        .update({
          ...currentProfile,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('*')
        .single();

      if (error) throw error;

      return { user: profile, error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar avatar:', error);
      return {
        user: null,
        error: new Error(error.message || 'Erro ao atualizar avatar')
      };
    }
  }

  async removeAvatar(userId: string): Promise<AuthResponse> {
    try {
      // Buscar perfil atual
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!currentProfile) {
        throw new Error('Perfil não encontrado');
      }

      // Atualizar perfil mantendo outros dados
      const { data: profile, error } = await supabase
        .from('profiles')
        .update({
          ...currentProfile,
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('*')
        .single();

      if (error) throw error;

      return { user: profile, error: null };
    } catch (error: any) {
      console.error('Erro ao remover avatar:', error);
      return {
        user: null,
        error: new Error(error.message || 'Erro ao remover avatar')
      };
    }
  }
}

export const userService = UserService.getInstance(); 