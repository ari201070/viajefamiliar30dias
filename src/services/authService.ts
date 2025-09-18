import { auth } from './firebaseConfig.ts';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';

const provider = new GoogleAuthProvider();

export const authService = {
  signInWithGoogle: async (): Promise<User | null> => {
    if (!auth) {
        console.error("Firebase Auth is not initialized.");
        return null;
    }
    try {
      const result = await signInWithPopup(auth, provider);
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
      await signOut(auth);
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
    return onAuthStateChanged(auth, callback);
  },
};