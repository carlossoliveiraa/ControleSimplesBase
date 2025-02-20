import { supabase } from '../lib/supabase';
import type { Usuario } from '../types';
import { useAuthStore } from '../stores/authStore';

export interface SignUpData {
  email: string;
  password: string;
  nome: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp({ email, password, nome }: SignUpData) {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome
          }
        }
      });

      if (error) throw error;
      return { user };
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  },

  async signIn({ email, password }: SignInData) {
    try {
      const { data: { session, user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!user) throw new Error('Usuário não encontrado');

      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw new Error('Erro ao buscar perfil do usuário');

      const userData: Usuario = {
        id: user.id,
        email: user.email!,
        nome: profile.nome,
        avatar_url: profile.avatar_url,
        status: 'online',
        ultimo_acesso: new Date().toISOString(),
        telefone: profile.telefone,
        data_nascimento: profile.data_nascimento,
        configuracoes: profile.configuracoes || {
          tema: 'light',
          idioma: 'pt-BR'
        },
        created_at: profile.created_at || new Date().toISOString(),
        updated_at: profile.updated_at || new Date().toISOString()
      };

      return { session, user: userData };
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return { user: null, error };
    }

    try {
      // Buscar dados adicionais do usuário na tabela profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        // Se o perfil não existir, criar um novo
        if (profileError.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              nome: user.user_metadata.nome || user.email!.split('@')[0],
              email: user.email,
              status: 'online',
              configuracoes: {
                tema: 'light',
                idioma: 'pt-BR'
              }
            })
            .select()
            .single();

          if (createError) throw createError;
          return {
            user: {
              id: user.id,
              email: user.email!,
              nome: newProfile.nome,
              avatar_url: null,
              status: 'online',
              ultimo_acesso: null,
              telefone: null,
              data_nascimento: null,
              configuracoes: {
                tema: 'light',
                idioma: 'pt-BR'
              },
              created_at: null,
              updated_at: null
            } as Usuario,
            error: null
          };
        }
        throw profileError;
      }

      const userData: Usuario = {
        id: user.id,
        email: user.email!,
        nome: profile.nome || user.email!.split('@')[0],
        avatar_url: profile.avatar_url,
        status: profile.status || 'online',
        ultimo_acesso: profile.ultimo_acesso,
        telefone: profile.telefone,
        data_nascimento: profile.data_nascimento,
        configuracoes: profile.configuracoes || {
          tema: 'light',
          idioma: 'pt-BR'
        },
        created_at: profile.created_at || new Date().toISOString(),
        updated_at: profile.updated_at || new Date().toISOString()
      };

      return { user: userData, error: null };
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return { user: null, error };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Limpar o estado do usuário
      useAuthStore.getState().setIsAuthenticated(false);
      useAuthStore.getState().setUser(null);

      return { error: null };
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      return { error };
    }
  },

  async updateAvatar(userId: string, file: File) {
    try {
      if (!userId) throw new Error('ID do usuário não encontrado');

      // Buscar perfil atual
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!currentProfile) throw new Error('Perfil não encontrado');

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

      // Gerar URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Atualizar apenas o avatar_url mantendo os outros dados
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...currentProfile,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('*')
        .single();

      if (updateError) throw updateError;

      return { profile: updatedProfile, error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar avatar:', error);
      return { 
        profile: null,
        error: new Error(error.message || 'Erro ao atualizar avatar')
      };
    }
  },

  async updateUserName(userId: string, newName: string) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update({ nome: newName })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { user: data as Usuario, error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar nome:', error);
      return { 
        user: null, 
        error: new Error(error.message || 'Erro ao atualizar nome. Por favor, tente novamente.')
      };
    }
  },

  async removeAvatar(userId: string) {
    try {
      // Primeiro buscar o avatar atual
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      // Se existir um avatar, remover do storage
      if (currentProfile?.avatar_url) {
        const oldFileName = currentProfile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([`${userId}/${oldFileName}`]);
        }
      }

      // Atualizar o perfil removendo a referência do avatar
      const { error } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error('Erro ao remover avatar:', error);
      return { 
        error: new Error(error.message || 'Erro ao remover avatar')
      };
    }
  },

  async updateProfile(userId: string, data: Partial<Usuario>) {
    try {
      if (!userId) throw new Error('ID do usuário não encontrado');

      // Remover campos que não devem ser atualizados
      const { id, email, created_at, updated_at, ...updateData } = data;

      // Atualizar o perfil
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('*')
        .single();

      if (updateError) throw updateError;

      return { profile: updatedProfile, error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      return {
        profile: null,
        error: new Error(error.message || 'Erro ao atualizar perfil')
      };
    }
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Configurar headers de segurança
  async setSecurityHeaders() {
    if (typeof window !== 'undefined') {
      document.head.querySelector('meta[http-equiv="Content-Security-Policy"]')?.remove();
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = `
        default-src 'self';
        img-src 'self' data: https: blob:;
        style-src 'self' 'unsafe-inline';
        script-src 'self' 'unsafe-inline';
        connect-src 'self' https://*.supabase.co wss://*.supabase.co;
        frame-src 'self' https://*.supabase.co;
        font-src 'self' data:;
      `.replace(/\s+/g, ' ').trim();
      document.head.appendChild(meta);
    }
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    return { error };
  },

  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      throw new Error(error.message || 'Erro ao atualizar senha');
    }
  },

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return false; // Não encontrado
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return false;
    }
  },
}; 