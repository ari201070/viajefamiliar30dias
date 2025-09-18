
import React, { useState } from 'react';

const FirebaseSetup: React.FC = () => {
    const [configInput, setConfigInput] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        setError('');
        let input = configInput.trim();

        if (!input) {
            setError('El campo de configuración no puede estar vacío.');
            return;
        }

        // Intenta extraer el objeto si el usuario pegó el bloque completo "const firebaseConfig = {...}"
        const match = input.match(/=\s*({[\s\S]*?});?$/);
        if (match && match[1]) {
            input = match[1];
        }

        try {
            // Intento 1: Parsear como JSON estricto (puede que el usuario pegue desde Vercel)
            const configObj = JSON.parse(input);
            if (!configObj.apiKey || !configObj.projectId) {
                throw new Error('Faltan claves esenciales de Firebase.');
            }
            localStorage.setItem('firebaseConfig', JSON.stringify(configObj));
            window.location.reload();
        } catch (e) {
            // Intento 2: Si falla el JSON.parse, es probable que sea un objeto JS sin comillas en las claves.
            // Lo solucionamos con una expresión regular para añadir las comillas.
            try {
                // Regex: busca una clave (letras, números, _) sin comillas antes de los dos puntos.
                const jsonString = input.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
                const configObj = JSON.parse(jsonString);

                if (!configObj.apiKey || !configObj.projectId) {
                    throw new Error('Faltan claves esenciales de Firebase.');
                }
                localStorage.setItem('firebaseConfig', JSON.stringify(configObj));
                window.location.reload();

            } catch (finalError) {
                setError('El formato no es válido. Asegúrate de copiar el objeto de configuración de Firebase correctamente.');
                console.error("Error final al parsear la configuración de Firebase:", finalError);
            }
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
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">
                            Ve a la Configuración de tu proyecto → General → Tus apps → Config. 
                            <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1">
                                Abrir consola de Firebase <i className="fas fa-external-link-alt fa-xs"></i>
                            </a>
                        </p>
                        <textarea
                            id="firebaseConfig"
                            rows={10}
                            value={configInput}
                            onChange={(e) => setConfigInput(e.target.value)}
                            placeholder={`Pega aquí el objeto de configuración. Puedes pegar el bloque completo (const firebaseConfig = {...}) o solo el contenido {...}. Ambos funcionan.\n\nconst firebaseConfig = {\n  apiKey: "AIza...",\n  authDomain: "tu-proyecto.firebaseapp.com",\n  ...\n};`}
                            className="w-full p-3 font-mono text-xs border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-slate-900 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}
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
