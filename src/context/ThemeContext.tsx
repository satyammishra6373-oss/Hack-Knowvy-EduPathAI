import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeId, ThemeConfig, AVAILABLE_THEMES } from '../types/theme';

interface ThemeContextType {
  currentTheme: ThemeId;
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemeId) => void;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'edupath_theme_id';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && AVAILABLE_THEMES.some((t) => t.id === saved)) {
        return saved as ThemeId;
      }
    } catch {
      // LocalStorage not accessible
    }
    return 'indigo';
  });

  const themeConfig = AVAILABLE_THEMES.find((t) => t.id === currentTheme) || AVAILABLE_THEMES[0];

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch {
      // Ignore storage errors
    }

    const root = document.documentElement;
    // Remove previous theme classes
    AVAILABLE_THEMES.forEach((t) => {
      root.classList.remove(`theme-${t.id}`);
    });
    // Add current theme class & data-theme
    root.classList.add(`theme-${currentTheme}`);
    root.setAttribute('data-theme', currentTheme);

    if (themeConfig.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [currentTheme, themeConfig]);

  const setTheme = (theme: ThemeId) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeConfig,
        setTheme,
        availableThemes: AVAILABLE_THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
