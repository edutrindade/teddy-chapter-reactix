import React, { createContext, useCallback, useContext, useState } from "react";

type TabBarVisibilityContextValue = {
  hideTabBar: boolean;
  setHideTabBar: (hide: boolean) => void;
};

const TabBarVisibilityContext = createContext<TabBarVisibilityContextValue | null>(null);

export function TabBarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [hideTabBar, setHideTabBarState] = useState(false);
  const setHideTabBar = useCallback((hide: boolean) => {
    setHideTabBarState(hide);
  }, []);

  const value = React.useMemo(
    () => ({ hideTabBar, setHideTabBar }),
    [hideTabBar, setHideTabBar]
  );

  return (
    <TabBarVisibilityContext.Provider value={value}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
}

export function useTabBarVisibility() {
  const ctx = useContext(TabBarVisibilityContext);
  if (!ctx) return { hideTabBar: false, setHideTabBar: () => {} };
  return ctx;
}
