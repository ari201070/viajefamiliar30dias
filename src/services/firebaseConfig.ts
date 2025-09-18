import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from '@firebase/storage';

// Priority order:
// 1. Vite environment variable (for Vercel/builds)
// 2. LocalStorage (for easy local setup via UI)
const env = (import.meta as any).env;
const firebaseConfigFromEnv = env ? env.VITE_FIREBASE_CONFIG : undefined;
const firebaseConfigFromLocalStorage = localStorage.getItem('firebaseConfig');

const firebaseConfigString = firebaseConfigFromEnv || firebaseConfigFromLocalStorage;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

// Export a status flag that can be checked by the UI
export let isFirebaseConfigured = false;

if (firebaseConfigString) {
  try {
    const firebaseConfig = JSON.parse(firebaseConfigString);
    // Basic validation to ensure the object is not empty or malformed
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      storage = getStorage(app);
      isFirebaseConfigured = true;
      console.log("Firebase initialized successfully.");
    } else {
       throw new Error("Firebase config object is missing 'apiKey' or 'projectId'.");
    }
  } catch (error) {
    console.error("Failed to parse or initialize Firebase config:", error);
    // Clear potentially corrupt data from localStorage to allow the user to try again
    if (firebaseConfigFromLocalStorage) {
      localStorage.removeItem('firebaseConfig');
    }
  }
}

if (!isFirebaseConfigured) {
    console.warn("Firebase config not found in environment variables or localStorage. Real-time sync features will be disabled.");
}

export { app, db, storage };
