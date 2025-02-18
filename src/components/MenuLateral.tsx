import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  isActive?: boolean;
}

const MenuItem = ({ to, icon, label, badge, isActive }: MenuItemProps) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive ? 'bg-[#4A90E2] text-white' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <div className={isActive ? 'text-white' : 'text-gray-400'}>{icon}</div>
    <span className="flex-1">{label}</span>
    {badge && (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        {badge}
      </span>
    )}
  </Link>
);

export function MenuLateral() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verificar se está na rota principal ou perfil
  const isProfileActive = location.pathname === '/' || location.pathname === '/perfil';

  const handleLogout = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 h-full flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#4A90E2] rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">CS</span>
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
              Controle Simples
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 py-4">
            <MenuItem
              to="/"
              isActive={isProfileActive}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              label="Perfil"
            />
            <MenuItem
              to="/configuracoes"
              isActive={location.pathname === '/configuracoes'}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              label="Configurações"
            />
            <MenuItem
              to="/ajuda"
              isActive={location.pathname === '/ajuda'}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Ajuda"
            />
          </div>

          {/* Botão de Sair */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-100 rounded-lg transition-colors w-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
} 