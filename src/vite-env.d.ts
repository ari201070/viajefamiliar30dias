// This file is for TypeScript type definitions for Vite's environment variables.
// Since we are no longer using `import.meta.env.DEV` and instead using a runtime
// check, the custom definitions that caused errors are no longer needed.

interface ImportMetaEnv {
  // We no longer define DEV here to avoid conflicts and because it's unused.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
