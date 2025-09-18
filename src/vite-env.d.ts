/// <reference types="vite/client" />

// This file provides TypeScript definitions for Vite's environment variables.
// By augmenting the ImportMetaEnv interface, we get type-safety and autocompletion
// for our custom environment variables.

interface ImportMetaEnv {
  /**
   * Holds the Firebase configuration as a JSON string.
   * This is sourced from the `.env` file locally or from deployment environment's variables.
   */
  readonly VITE_FIREBASE_CONFIG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
