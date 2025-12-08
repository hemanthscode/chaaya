/**
 * Theme Context
 * Manages dark/light theme state
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { THEMES } from '@utils/constants';
import * as storage from '@utils/storage';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEMES.LIGHT);

  /**
   * Initialize theme from storage or system preference
   */
  useEffect(() => {
    const storedTheme = storage.getTheme();
    
    if (storedTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? THEMES.DARK : THEMES.LIGHT;
      setTheme(systemTheme);
      applyTheme(systemTheme);
    }
  }, []);

  /**
   * Apply theme to document
   */
  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === THEMES.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  /**
   * Toggle theme
   */
  const toggleTheme = useCallback(() => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
    storage.setTheme(newTheme);
    applyTheme(newTheme);
  }, [theme]);

  /**
   * Set specific theme
   */
  const setThemeMode = useCallback((newTheme) => {
    if (newTheme !== THEMES.LIGHT && newTheme !== THEMES.DARK) {
      console.error('Invalid theme:', newTheme);
      return;
    }

    setTheme(newTheme);
    storage.setTheme(newTheme);
    applyTheme(newTheme);
  }, []);

  /**
   * Check if dark mode is active
   */
  const isDark = theme === THEMES.DARK;

  const value = {
    theme,
    isDark,
    toggleTheme,
    setThemeMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
