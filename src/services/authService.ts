// FIX: Use firebase compat to resolve module errors.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from './firebaseConfig.ts';
import type { User } from '../types.ts';

const provider = new firebase.auth.GoogleAuthProvider();

export const authService = {
  signInWithGoogle: async (): Promise<User | null> => {
    if (!auth) {
        console.error("Firebase Auth is not initialized.");
        return null;
    }
    try {
      // FIX: Use compat API for signInWithPopup.
      const result = await auth.signInWithPopup(provider);
      return result.user;
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      // Handle specific errors like popup closed by user
      if ((error as any).code === 'auth/popup-closed-by-user') {
        // User closed the popup, do nothing.
      }
      return null;
    }
  },

  signOutUser: async (): Promise<void> => {
    if (!auth) {
        console.error("Firebase Auth is not initialized.");
        return;
    }
    try {
      // FIX: Use compat API for signOut.
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  },

  onAuthChange: (callback: (user: User | null) => void): (() => void) => {
    if (!auth) {
      // If auth is not ready, immediately call back with null user and return an empty unsubscribe function
      callback(null);
      return () => {};
    }
    // This sets up the listener and returns the unsubscribe function provided by Firebase
    // FIX: Use compat API for onAuthStateChanged.
    return auth.onAuthStateChanged(callback);
  },
};