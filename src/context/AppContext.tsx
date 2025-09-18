import { createContext, useContext } from 'react';
// FIX: Corrected firebase/auth import path to @firebase/auth.
import type { User } from '@firebase/auth';
import { AppContextType } from '../types.ts';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
