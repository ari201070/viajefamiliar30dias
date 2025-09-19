import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseCredentials } from '../firebaseCredentials.ts';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;
export let isFirebaseConfigured = false;
export let firebaseConfigError: string | null = null;

// Check if the credentials have been replaced from the placeholder values.
if (firebaseCredentials && firebaseCredentials.apiKey && firebaseCredentials.apiKey !== "REPLACE_WITH_YOUR_API_KEY") {
  try {
    app = initializeApp(firebaseCredentials);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
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