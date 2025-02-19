import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import Swal from 'sweetalert2';

interface InfoUsuarioProps {
  nome: string;
  email: string;
  avatar: string | null;
  userId: string;
  onAvatarUpdate: (url: string | null) => void;
  onNameUpdate?: (newName: string) => void;
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
  validName?: string;
}

interface UpdateAvatarResponse {
  profile: {
    avatar_url: string;
  } | null;
  error: Error | null;
}

export function InfoUsuario({ 
  nome, 
  email, 
  avatar, 
  userId, 
  onAvatarUpdate,
  onNameUpdate 
}: InfoUsuarioProps) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const primeiraLetra = nome.charAt(0).toUpperCase();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const validateName = (name: string | undefined): ValidationResult => {
    if (!name) {
      return { isValid: false, message: 'Nome é obrigatório' };
    }
    
    const trimmedName = name.trim().replace(/\s+/g, ' ');
    
    if (!trimmedName) {
      return { isValid: false, message: 'O nome não pode ficar em branco' };
    }

    // Verifica o tamanho mínimo e máximo
    if (trimmedName.length < 2) {
      return { isValid: false, message: 'O nome deve ter pelo menos 2 caracteres' };
    }
    if (trimmedName.length > 50) {
      return { isValid: false, message: 'O nome deve ter no máximo 50 caracteres' };
    }

    // Verifica se contém apenas números
    if (/^\d+$/.test(trimmedName)) {
      return { isValid: false, message: 'O nome não pode conter apenas números' };
    }

    // Verifica se contém apenas emojis
    const emojiRegex = /^[\p{Emoji}|\s]+$/u;
    if (emojiRegex.test(trimmedName)) {
      return { isValid: false, message: 'O nome não pode conter apenas emojis' };
    }

    // Verifica se contém caracteres válidos (letras, espaços, acentos e alguns caracteres especiais comuns em nomes)
    const validNameRegex = /^[\p{L}\s\-'.]+$/u;
    if (!validNameRegex.test(trimmedName)) {
      return { isValid: false, message: 'O nome contém caracteres inválidos' };
    }

    return { isValid: true, validName: trimmedName };
  };

  const handleLogout = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleEditName = async () => {
    try {
      const { value: newName } = await Swal.fire({
        title: 'Editar nome',
        input: 'text',
        inputLabel: 'Novo nome',
        inputValue: nome,
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#00a884',
        inputValidator: (value) => {
          const validation = validateName(value);
          if (!validation.isValid) {
            return validation.message;
          }
          return null;
        },
        customClass: {
          input: 'swal2-input text-sm',
        },
        footer: `
          <div class="text-xs text-gray-500">
            • O nome deve ter entre 2 e 50 caracteres<br>
            • Pode conter letras, espaços e caracteres como - ' .<br>
            • Não pode conter apenas números ou emojis
          </div>
        `
      });

      if (newName) {
        const validation = validateName(newName);
        if (validation.isValid && validation.validName !== nome) {
          const { user, error } = await authService.updateUserName(userId, validation.validName);
          
          if (error) throw error;

          if (user) {
            onNameUpdate?.(user.nome);
            await Swal.fire({
              icon: 'success',
              title: 'Nome atualizado!',
              timer: 2000,
              timerProgressBar: true,
              confirmButtonColor: '#00a884',
            });
          }
        }
      }
    } catch (error: any) {
      console.error('Erro ao atualizar nome:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Ops! Algo deu errado',
        text: error.message || 'Erro ao atualizar nome.',
        confirmButtonColor: '#00a884'
      });
    } finally {
      setIsDropdownOpen(false);
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUpdatingAvatar(true);
      const { profile, error } = await authService.updateAvatar(userId, file) as UpdateAvatarResponse;
      
      if (error) throw error;
      if (profile?.avatar_url) {
        onAvatarUpdate(profile.avatar_url);
      }
    } catch (error: any) {
      console.error('Erro ao atualizar avatar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao atualizar avatar',
        text: error.message || 'Por favor, tente novamente.',
      });
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const result = await Swal.fire({
        title: 'Remover foto?',
        text: 'Tem certeza que deseja remover sua foto de perfil?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00a884',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, remover',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        setIsUpdatingAvatar(true);
        const { error } = await authService.removeAvatar(userId);
        
        if (error) throw error;
        
        onAvatarUpdate(null);
        
        await Swal.fire({
          icon: 'success',
          title: 'Foto removida!',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    } catch (error: any) {
      console.error('Erro ao remover avatar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao remover foto',
        text: error.message || 'Por favor, tente novamente.',
      });
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center gap-3 w-full min-w-0 relative">
      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Avatar com menu de contexto */}
      <div className="flex-shrink-0 relative group">
        {avatar ? (
          <>
            <img
              src={avatar}
              alt="Seu perfil"
              className={`w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80 ${
                isUpdatingAvatar ? 'opacity-50' : ''
              }`}
              onClick={handleAvatarClick}
              title="Clique para alterar sua foto"
            />
            {/* Menu de opções do avatar */}
            <div className="absolute hidden group-hover:flex -bottom-2 -right-2 gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAvatarClick();
                }}
                className="bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
                title="Alterar foto"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAvatar();
                }}
                className="bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
                title="Remover foto"
              >
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div 
            className={`w-12 h-12 rounded-full bg-[#00a884] flex items-center justify-center cursor-pointer hover:opacity-80 ${
              isUpdatingAvatar ? 'opacity-50' : ''
            }`}
            onClick={handleAvatarClick}
            title="Clique para adicionar uma foto"
          >
            <span className="text-white text-xl font-semibold">{primeiraLetra}</span>
          </div>
        )}
        {isUpdatingAvatar && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Informações do usuário com dropdown */}
      <div 
        className="min-w-0 flex-1 group cursor-pointer select-none"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center gap-1">
          <h3 className="font-semibold text-gray-900 truncate max-w-full">
            {nome}
          </h3>
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <p className="text-xs text-gray-500 truncate max-w-full">
          {email}
        </p>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <>
          {/* Overlay para fechar o dropdown ao clicar fora */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Menu dropdown */}
          <div className="absolute left-0 top-full mt-2 w-48 rounded-lg bg-white border border-gray-100 shadow-lg shadow-gray-100/50 z-20">
            <div className="py-1">
              {/* Editar Perfil */}
              <button
                onClick={() => navigate('/perfil')}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Editar perfil
              </button>

              {/* Botão Sair */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 