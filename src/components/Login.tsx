import { useState, FC } from 'react';
import { authService } from '../services/authService.ts';
import { useAppContext } from '../context/AppContext.tsx';

const Login: FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useAppContext();

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const result = await authService.signInWithGoogle();
    if (!result.success) {
      setError(result.error?.message || t('login_error_generic'));
    }
    setIsLoading(false);
    // On success, the onAuthChange listener in App.tsx will handle the state update
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl text-center">
        <div className="mb-8">
            <i className="fas fa-plane-departure text-6xl text-indigo-600 dark:text-indigo-400"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2">{t('tituloPrincipal')}</h1>
        <p className="text-gray-600 dark:text-slate-400 mb-8">{t('bienvenidaPrincipal')}</p>
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center"
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin text-xl"></i>
          ) : (
            <>
              <i className="fab fa-google text-xl mr-3"></i>
              Iniciar sesión con Google
            </>
          )}
        </button>
        {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
