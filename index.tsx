import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App.tsx';

// Mostrar la versión del proyecto en la consola
console.log("Versión del proyecto:", process.env.GEMINI_API_KEY);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
