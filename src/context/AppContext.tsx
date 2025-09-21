import { createContext, useContext } from 'react';
// FIX: Removed incorrect import of User type. It's now handled within AppContextType from types.ts
import { AppContextType } from '../types.ts';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};