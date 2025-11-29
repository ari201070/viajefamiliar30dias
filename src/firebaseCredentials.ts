// =================================================================================
// Credenciales de Firebase actualizadas según la configuración del usuario.
// El problema era que el código usaba un appId obsoleto.
// Este nuevo appId está correctamente asociado con el dominio de Vercel
// en la consola de Firebase.
// =================================================================================

export const firebaseCredentials = {
  apiKey: "AIzaSyAbwv-3H9S4Q2lRlIBWWYXIs1QOLD9iREQ",
  authDomain: "viajes-argentina-en-30-dias.firebaseapp.com",
  projectId: "viajes-argentina-en-30-dias",
  storageBucket: "viajes-argentina-en-30-dias.firebasestorage.app",
  messagingSenderId: "52421464497",
  appId: "1:52421464497:web:5b48fe7b53783a087bad90"
};