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
    console.error(`CRITICAL: Firebase initialization failed. Check the configuration object in src/firebaseCredentials.ts. Details: ${error.message}`);
  }
} else {
  // If credentials are not filled in, the app will use local storage fallbacks.
  // We log a warning for the developer, but we don't treat it as a critical, blocking error.
  console.warn("Firebase not configured. App is running in local/offline mode. Sync features will be disabled.");
}

export { app, db, storage, auth };