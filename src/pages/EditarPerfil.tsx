import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { useAuthStore } from '../stores/authStore';
import { formatPhoneNumber } from '../utils/formatters';
import Swal from 'sweetalert2';
import InputMask from 'react-input-mask';

interface FormData {
  nome: string;
  telefone: string;
  data_nascimento: string;
  avatar_url: string | null;
}

export function EditarPerfil() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nome: user?.nome || '',
    telefone: user?.telefone || '',
    data_nascimento: user?.data_nascimento || '',
    avatar_url: user?.avatar_url || null
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        telefone: formatPhoneNumber(user.telefone) || '',
        data_nascimento: user.data_nascimento || '',
        avatar_url: user.avatar_url || null
      });
    }
  }, [user]);

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setIsUpdatingAvatar(true);
      const { user: updatedUser, error } = await userService.updateAvatar(user.id, file);
      
      if (error) throw error;
      
      if (updatedUser) {
        setUser({
          ...updatedUser,
          configuracoes: updatedUser.configuracoes || {
            tema: 'light',
            idioma: 'pt-BR'
          }
        });
        setFormData(prev => ({
          ...prev,
          avatar_url: updatedUser.avatar_url || null
        }));

        await Swal.fire({
          icon: 'success',
          title: 'Foto atualizada!',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error: any) {
      console.error('Erro ao atualizar foto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao atualizar foto',
        text: error.message
      });
    } finally {
      setIsUpdatingAvatar(false);
      e.target.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatar_url: null
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setIsLoading(true);

      const { user: updatedUser, error } = await userService.updateProfile(user.id, {
        nome: formData.nome,
        telefone: formData.telefone.replace(/\D/g, ''),
        data_nascimento: formData.data_nascimento,
        avatar_url: formData.avatar_url,
      });

      if (error) throw error;

      if (updatedUser) {
        setUser({
          ...updatedUser,
          configuracoes: updatedUser.configuracoes || {
            tema: 'light',
            idioma: 'pt-BR'
          }
        });
        await Swal.fire({
          icon: 'success',
          title: 'Perfil atualizado!',
          timer: 1500,
          showConfirmButton: false
        });
        navigate('/');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao atualizar perfil',
        text: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gerar arrays para os dropdowns
  const dias = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const meses = [
    { valor: '01', nome: 'Janeiro' },
    { valor: '02', nome: 'Fevereiro' },
    { valor: '03', nome: 'Março' },
    { valor: '04', nome: 'Abril' },
    { valor: '05', nome: 'Maio' },
    { valor: '06', nome: 'Junho' },
    { valor: '07', nome: 'Julho' },
    { valor: '08', nome: 'Agosto' },
    { valor: '09', nome: 'Setembro' },
    { valor: '10', nome: 'Outubro' },
    { valor: '11', nome: 'Novembro' },
    { valor: '12', nome: 'Dezembro' }
  ];
  const anoAtual = new Date().getFullYear();
  const anos = Array.from(
    { length: 100 }, 
    (_, i) => (anoAtual - i).toString()
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Editar Perfil</h1>

        {/* Avatar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            {user?.avatar_url ? (
              <div className="relative">
                <img
                  src={user.avatar_url + '?t=' + new Date().getTime()}
                  alt="Seu perfil"
                  className="w-24 h-24 rounded-full object-cover border border-gray-200"
                />
                {isUpdatingAvatar && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#4A90E2] text-white flex items-center justify-center text-2xl font-medium">
                {user?.nome?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-[#4A90E2] text-white p-2 rounded-full cursor-pointer hover:bg-[#357ABD] transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={isUpdatingAvatar}
              />
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </label>
          </div>

          {user?.avatar_url && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              disabled={isUpdatingAvatar}
              className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remover foto
            </button>
          )}
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <InputMask
              mask="(99) 99999-9999"
              value={formData.telefone}
              onChange={e => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={formData.data_nascimento?.split('-')[2] || ''}
                onChange={e => {
                  const [ano, mes] = formData.data_nascimento?.split('-') || ['', ''];
                  setFormData(prev => ({
                    ...prev,
                    data_nascimento: `${ano || anoAtual}-${mes || '01'}-${e.target.value}`
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              >
                <option value="">Dia</option>
                {dias.map(dia => (
                  <option key={dia} value={dia}>
                    {dia}
                  </option>
                ))}
              </select>

              <select
                value={formData.data_nascimento?.split('-')[1] || ''}
                onChange={e => {
                  const [ano, , dia] = formData.data_nascimento?.split('-') || ['', '', ''];
                  setFormData(prev => ({
                    ...prev,
                    data_nascimento: `${ano || anoAtual}-${e.target.value}-${dia || '01'}`
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              >
                <option value="">Mês</option>
                {meses.map(mes => (
                  <option key={mes.valor} value={mes.valor}>
                    {mes.nome}
                  </option>
                ))}
              </select>

              <select
                value={formData.data_nascimento?.split('-')[0] || ''}
                onChange={e => {
                  const [, mes, dia] = formData.data_nascimento?.split('-') || ['', '', ''];
                  setFormData(prev => ({
                    ...prev,
                    data_nascimento: `${e.target.value}-${mes || '01'}-${dia || '01'}`
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              >
                <option value="">Ano</option>
                {anos.map(ano => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4A90E2] text-white py-2 px-4 rounded-md hover:bg-[#357ABD] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
} 