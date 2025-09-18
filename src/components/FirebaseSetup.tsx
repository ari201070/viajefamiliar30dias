import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';

const FirebaseSetup: React.FC = () => {
    const { t } = useAppContext();
    const [configInput, setConfigInput] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        setError('');
        let configString = configInput.trim();

        // If user pastes the full `const firebaseConfig = { ... };`, extract the object.
        if (configString.includes('const firebaseConfig =')) {
            const match = configString.match(/=\s*({[\s\S]*?});?/);
            if (match && match[1]) {
                configString = match[1];
            } else {
                 setError('Formato de configuración no válido. Asegúrate de copiar el objeto completo.');
                 return;
            }
        }
        
        // Also handle if they just paste the object without the outer braces if it's on multi-lines
        if (!configString.startsWith('{')) {
            configString = `{${configString}}`;
        }
        
        try {
            // A more robust way to parse potentially malformed JSON-like objects from copy-paste
            // This is a bit of a hack, but handles common copy-paste errors like trailing commas or unquoted keys.
            const cleanedString = configString
                .replace(/(\w+):/g, '"$1":') // Quote keys
                .replace(/,\s*([}\]])/g, '$1'); // Remove trailing commas
                
            const configObj = JSON.parse(cleanedString);

            if (!configObj.apiKey || !configObj.projectId) {
                setError('El objeto de configuración no es válido. Faltan "apiKey" o "projectId".');
                return;
            }
            // Store the valid, cleaned JSON string
            localStorage.setItem('firebaseConfig', JSON.stringify(configObj));
            window.location.reload();
        } catch (e) {
            setError('El texto pegado no es válido. Por favor, copia el objeto de configuración de Firebase exactamente como aparece en la consola.');
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-4">
                    <i className="fas fa-plug mr-3"></i>
                    Conectar a Firebase para Sincronización
                </h2>
                <p className="text-gray-600 dark:text-slate-400 mb-6">
                    Para activar la sincronización de datos (fotos, listas) entre dispositivos, necesitas conectar la app a tu proyecto de Firebase.
                </p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="firebaseConfig" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                            1. Copia tu objeto `firebaseConfig` desde la consola de Firebase.
                        </label>
                        <textarea
                            id="firebaseConfig"
                            rows={10}
                            value={configInput}
                            onChange={(e) => setConfigInput(e.target.value)}
                            placeholder={`Pega aquí el objeto de configuración completo. Se verá así:\n\nconst firebaseConfig = {\n  apiKey: "AIza...",\n  authDomain: "tu-proyecto.firebaseapp.com",\n  ...\n};`}
                            className="w-full p-3 font-mono text-xs border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-slate-900 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 dark:text-red-400 font-semibold">{error}</p>}
                    <div>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                            2. Haz clic para guardar. La configuración se almacenará localmente en tu navegador y la página se recargará.
                        </p>
                        <button
                            onClick={handleSave}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
                        >
                            Guardar Configuración y Recargar
                        </button>
                    </div>
                </div>
                 <p className="text-xs text-center text-gray-500 dark:text-slate-500 mt-6">
                    Esta configuración es solo para desarrollo local y no afecta la versión desplegada en Vercel.
                </p>
            </div>
        </div>
    );
};

export default FirebaseSetup;
