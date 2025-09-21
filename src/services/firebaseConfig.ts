// FIX: Switch to compat imports to fix module resolution errors.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import { firebaseCredentials } from '../firebaseCredentials.ts';

// FIX: Update types to match compat library objects.
let app: firebase.app.App | null = null;
let db: firebase.firestore.Firestore | null = null;
let storage: firebase.storage.Storage | null = null;
let auth: firebase.auth.Auth | null = null;
export let isFirebaseConfigured = false;
export let firebaseConfigError: string | null = null;

// Check if the credentials have been replaced from the placeholder values.
if (firebaseCredentials && firebaseCredentials.apiKey && firebaseCredentials.apiKey !== "REPLACE_WITH_YOUR_API_KEY") {
  try {
    // FIX: Use compat initialization.
    if (!firebase.apps.length) {
      app = firebase.initializeApp(firebaseCredentials);
    } else {
      app = firebase.app();
    }
    db = firebase.firestore();
    storage = firebase.storage();
    auth = firebase.auth();
    isFirebaseConfigured = true;
    console.log("Firebase initialized successfully from firebaseCredentials.ts.");
  } catch (error: any) {
    firebaseConfigError = `CRITICAL: Firebase initialization failed. Check the configuration object in src/firebaseCredentials.ts. Details: ${error.message}`;
    console.error(firebaseConfigError);
  }
} else {
  firebaseConfigError = "CRITICAL: La configuración de Firebase está incompleta. Por favor, edita el archivo 'src/firebaseCredentials.ts' y reemplaza los valores de ejemplo con la configuración real de tu proyecto de Firebase.";
  console.error(firebaseConfigError);
}

export { app, db, storage, auth };