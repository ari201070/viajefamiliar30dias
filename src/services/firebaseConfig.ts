import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// --- Vite Standard Environment Variable Handling ---
const firebaseConfigJSON = import.meta.env?.VITE_FIREBASE_CONFIG;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;
export let isFirebaseConfigured = false;
export let firebaseConfigError: string | null = null; // Export error details

// Attempt to parse the JSON string and initialize Firebase.
if (firebaseConfigJSON) {
  try {
    const firebaseConfigObject = JSON.parse(firebaseConfigJSON);
    
    // Basic validation of the parsed object to ensure it has required keys.
    if (firebaseConfigObject && firebaseConfigObject.apiKey && firebaseConfigObject.projectId) {
        app = initializeApp(firebaseConfigObject);
        db = getFirestore(app);
        storage = getStorage(app);
        auth = getAuth(app);
        isFirebaseConfigured = true;
        console.log("Firebase initialized successfully from VITE_FIREBASE_CONFIG environment variable.");
    } else {
        firebaseConfigError = "CRITICAL: Parsed Firebase configuration is invalid or missing essential keys (apiKey, projectId).";
    }
  } catch (error: any) {
    firebaseConfigError = `CRITICAL: Failed to parse VITE_FIREBASE_CONFIG. Ensure it's valid JSON. Details: ${error.message}`;
  }
} else {
    firebaseConfigError = "CRITICAL: VITE_FIREBASE_CONFIG environment variable was not found. Please create a .env file and add the variable.";
}

// If configuration failed, log the specific error to the console.
if (!isFirebaseConfigured) {
  console.error(firebaseConfigError);
}

export { app, db, storage, auth };