import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
// FIX: Changed import path from 'firebase/storage' to '@firebase/storage' to resolve potential module resolution issues.
import { getStorage, FirebaseStorage } from '@firebase/storage';

// This VITE_FIREBASE_CONFIG variable must be set in your .env file
// and in your Vercel project settings. It should be a JSON string.
// Example: VITE_FIREBASE_CONFIG='{"apiKey":"...","authDomain":"...","projectId":"..."}'
// FIX: Cast `import.meta` to `any` to resolve TypeScript error about missing `env` property.
const firebaseConfigString = (import.meta as any).env.VITE_FIREBASE_CONFIG;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (!firebaseConfigString) {
  console.error("Firebase config (VITE_FIREBASE_CONFIG) not found in environment variables. Real-time sync will NOT work.");
} else {
  try {
    const firebaseConfig = JSON.parse(firebaseConfigString);
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Failed to parse or initialize Firebase config. Please check the VITE_FIREBASE_CONFIG variable:", error);
  }
}

export { app, db, storage };