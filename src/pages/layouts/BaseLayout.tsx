import { MenuLateral } from '../../components/MenuLateral';
import { HeaderPerfil } from '../../components/HeaderPerfil';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authService } from '../../services/auth';
import type { Usuario } from '../../types';
import { useAuthStore } from '../../stores/authStore';

export function BaseLayout() {
  const { user } = useAuthStore();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Menu Lateral - Desktop */}
      <div className="hidden lg:block h-full">
        <MenuLateral />
      </div>

      {/* Menu Lateral - Mobile */}
      {menuAberto && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setMenuAberto(false)}
          />
          <div className="relative flex h-full">
            <div className="bg-white dark:bg-gray-800 w-64">
              <MenuLateral />
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="p-4 sm:p-6 flex items-center justify-between">
            {/* Botão do Menu (Mobile) */}
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="lg:hidden text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Título da Página (pode ser dinâmico) */}
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              Principal
            </h1>

            {/* Área do Perfil (sempre à direita) */}
            <div className="flex items-center gap-4">
              {/* Botão de Tema */}
              <button
                className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => document.documentElement.classList.toggle('dark')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </button>

              {/* Perfil */}
              <HeaderPerfil 
                nome={user?.nome || ''}
                email={user?.email || ''}
                avatar={user?.avatar_url || null}
              />
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 