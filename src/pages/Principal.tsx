import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { formatPhoneNumber } from '../utils/formatters';
import { calcularIdade, getSigno } from '../utils/userInfo';

export function Principal() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const idade = calcularIdade(user?.data_nascimento || null);
  const signo = getSigno(user?.data_nascimento || null);

  const formatarData = (data: string | null | undefined) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {/* Cabeçalho */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Meu Perfil</h1>
            <button
              onClick={() => navigate('/perfil')}
              className="w-full sm:w-auto px-4 py-2 bg-[#4A90E2] text-white rounded-md hover:bg-[#357ABD] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Informações do Usuário */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.nome}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#4A90E2] dark:border-[#5b96f7]"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#4A90E2] dark:bg-[#5b96f7] text-white flex items-center justify-center text-3xl sm:text-4xl font-medium">
                  {user?.nome?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>

            {/* Dados do Usuário */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nome</h3>
                  <p className="text-lg text-gray-900 dark:text-white">{user?.nome || '-'}</p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                  <p className="text-lg text-gray-900 dark:text-white">{user?.email || '-'}</p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Telefone</h3>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {formatPhoneNumber(user?.telefone || null) || '-'}
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Nascimento</h3>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {formatarData(user?.data_nascimento || null) || '-'}
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Idade</h3>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {idade ? `${idade} anos` : '-'}
                  </p>
                </div>

                {signo && (
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Signo</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl dark:text-[#5b96f7]" role="img" aria-label={signo.nome}>
                        {signo.icone}
                      </span>
                      <div>
                        <p className="text-lg text-gray-900 dark:text-white">{signo.nome}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{signo.periodo}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${user?.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-lg text-gray-900 dark:text-white">
                      {user?.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Último Acesso</h3>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {user?.ultimo_acesso ? new Date(user.ultimo_acesso).toLocaleString('pt-BR') : '-'}
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Membro desde</h3>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : '-'
                    }
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status da Conta</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-lg text-gray-900 dark:text-white">Verificada</span>
                  </div>
                </div>
              </div>

              {/* Preferências */}
              <div className="mt-6 col-span-full">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Preferências</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-200">
                      Tema: {user?.configuracoes.tema === 'dark' ? 'Escuro' : 'Claro'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-200">
                      Idioma: {user?.configuracoes.idioma}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 