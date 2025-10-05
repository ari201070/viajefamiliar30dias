import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from './firebaseConfig.js';

const provider = new firebase.auth.GoogleAuthProvider();

export const authService = {
  signInWithGoogle: async () => {
    if (!auth) {
        const error = { message: "Firebase Auth is not initialized." };
        console.error(error.message);
        return { success: false, error };
    }
    try {
        await auth.signInWithPopup(provider);
        // The onAuthChange listener in App.jsx will handle the user state update on success.
        return { success: true };
    } catch (error) {
        // This will catch errors like the user closing the popup or environment issues.
        console.error("Google Sign-In with popup failed:", error);
        return { success: false, error };
    }
  },

  signOutUser: async () => {
    if (!auth) {
        console.error("Firebase Auth is not initialized.");
        return;
    }
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  },

  onAuthChange: (callback) => {
    if (!auth) {
      // If auth is not ready, immediately call back with null user and return an empty unsubscribe function
      callback(null);
      return () => {};
    }
    // This sets up the listener and returns the unsubscribe function provided by Firebase
    return auth.onAuthStateChanged(callback);
  },
};