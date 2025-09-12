import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Debug correcto en Vite:
console.log('API KEY:', import.meta.env.VITE_API_KEY);

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
