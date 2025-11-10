import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from './firebaseConfig.ts';
import type { User } from '../types.ts';

const provider = new firebase.auth.GoogleAuthProvider();

export const authService = {
  signInWithGoogle: async (): Promise<{ success: boolean; error?: any }> => {
    if (!auth) {
        const error = { message: "Firebase Auth is not initialized." };
        console.error(error.message);
        return { success: false, error };
    }
    try {
        await auth.signInWithRedirect(provider);
        // The user will be redirected to Google's sign-in page.
        // The result is handled on page load by getRedirectResult in App.tsx.
        return { success: true };
    } catch (error: any) {
        // This will catch errors like the user closing the popup or environment issues.
        console.error("Google Sign-In with redirect failed:", error);
        return { success: false, error };
    }
  },

  signOutUser: async (): Promise<void> => {
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

  onAuthChange: (callback: (user: User | null) => void): (() => void) => {
    if (!auth) {
      // If auth is not ready, immediately call back with null user and return an empty unsubscribe function
      callback(null);
      return () => {};
    }
    // This sets up the listener and returns the unsubscribe function provided by Firebase
    return auth.onAuthStateChanged(callback);
  },
};
