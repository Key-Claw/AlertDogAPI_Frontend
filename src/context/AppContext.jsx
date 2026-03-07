import { createContext, useMemo, useState } from 'react';

export const AppContext = createContext(null);

export function AppContextProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const value = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
    }),
    [sidebarOpen]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}