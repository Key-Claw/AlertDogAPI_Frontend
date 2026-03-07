// 1. Contexto global para estados compartidos de UI
import { createContext, useMemo, useState } from 'react';

export const AppContext = createContext(null);

// 2. Provider centralizado de estados globales
export function AppContextProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 3. Memorizar valor para evitar renders innecesarios
  const value = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
    }),
    [sidebarOpen]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}