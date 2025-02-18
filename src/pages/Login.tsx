import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';
import { useAuthStore } from '../stores/authStore';
import Swal from 'sweetalert2';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const { setIsAuthenticated, setUser } = useAuthStore();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Verificar email quando mudar
  useEffect(() => {
    const checkEmail = async () => {
      if (!isLogin && email && email.includes('@')) {
        setIsCheckingEmail(true);
        const exists = await authService.checkEmailExists(email);
        setIsCheckingEmail(false);

        if (exists) {
          const result = await Swal.fire({
            title: 'Email já cadastrado',
            text: 'Este email já está cadastrado. Deseja fazer login ou recuperar sua senha?',
            icon: 'warning',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Fazer Login',
            denyButtonText: 'Recuperar Senha',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#4A90E2',
            denyButtonColor: '#6B7280',
            cancelButtonColor: '#EF4444'
          });

          if (result.isConfirmed) {
            setIsLogin(true);
          } else if (result.isDenied) {
            navigate('/recuperar-senha', { state: { email } });
          }
        }
      }
    };

    const debounceTimeout = setTimeout(checkEmail, 500);
    return () => clearTimeout(debounceTimeout);
  }, [email, isLogin, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { session, user } = await authService.signIn({ email, password });
        if (user) {
          setIsAuthenticated(true);
          setUser(user);
          navigate('/');
        }
      } else {
        // Verificar email novamente antes de cadastrar
        const emailExists = await authService.checkEmailExists(email);
        if (emailExists) {
          throw new Error('Este email já está cadastrado');
        }

        if (password !== confirmPassword) {
          throw new Error('As senhas não conferem');
        }

        await authService.signUp({ email, password, nome });
        await Swal.fire({
          icon: 'success',
          title: 'Cadastro realizado!',
          text: 'Verifique seu email para confirmar o cadastro.',
          confirmButtonColor: '#4A90E2'
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error.message || 'Ocorreu um erro. Tente novamente.',
        confirmButtonColor: '#4A90E2'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLogin ? 'Entrar na sua conta' : 'Criar uma conta'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <div>
                <label htmlFor="nome" className="sr-only">
                  Nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required={!isLogin}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Nome completo"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isLogin ? 'rounded-t-md' : ''} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white`}
                placeholder="Email"
              />
              {isCheckingEmail && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Verificando email...
                </div>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Senha"
              />
            </div>
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirmar Senha
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required={!isLogin}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Confirmar senha"
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || isCheckingEmail}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {isLoading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isLogin
                ? 'Não tem uma conta? Cadastre-se'
                : 'Já tem uma conta? Entre'}
            </button>
            {isLogin && (
              <button
                type="button"
                onClick={() => navigate('/recuperar-senha')}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Esqueceu sua senha?
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 