import React from 'react';
import { authService } from '../services/authService.ts';

const Login: React.FC = () => {
  const handleLogin = async () => {
    await authService.signInWithGoogle();
    // The onAuthChange listener in App.tsx will handle the state change.
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all hover:scale-105 duration-300">
            <i className="fas fa-route text-6xl text-indigo-500 mb-5 animate-pulse"></i>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-200 mb-2">Viaje Familiar por Argentina</h1>
            <p className="text-gray-600 dark:text-slate-400 mb-8">Por favor, inicia sesión para acceder al itinerario.</p>
            <button
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all transform hover:scale-105 flex items-center justify-center text-lg"
            >
                <i className="fab fa-google text-xl mr-3"></i>
                Iniciar sesión con Google
            </button>
        </div>
    </div>
  );
};

export default Login;
