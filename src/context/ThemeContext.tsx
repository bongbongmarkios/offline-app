
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type Theme = 'light' | 'dark';
export type PrimaryColor = 'purple' | 'skyBlue' | 'avocadoGreen' | 'maroon';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  primaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
  isThemeReady: boolean; // New flag
}

// Define a default context value that won't cause an immediate error
const defaultThemeContextValue: ThemeContextValue = {
  theme: 'light', // Sensible default
  setTheme: () => console.warn('ThemeProvider not yet ready or mounted'),
  primaryColor: 'purple', // Sensible default
  setPrimaryColor: () => console.warn('ThemeProvider not yet ready or mounted'),
  isThemeReady: false, // Default to not ready
};

const ThemeContext = createContext<ThemeContextValue>(defaultThemeContextValue);

const colorVariables: Record<PrimaryColor, { light: string; dark: string; foreground: string; ringLight: string; ringDark: string }> = {
  purple: { 
    light: 'var(--primary-purple-hsl)', 
    dark: 'var(--primary-purple-hsl-dark)', 
    foreground: 'var(--primary-purple-foreground-hsl)',
    ringLight: 'var(--ring-purple-hsl)',
    ringDark: 'var(--ring-purple-hsl-dark)'
  },
  skyBlue: { 
    light: 'var(--primary-sky-blue-hsl)', 
    dark: 'var(--primary-sky-blue-hsl-dark)', 
    foreground: 'var(--primary-sky-blue-foreground-hsl)',
    ringLight: 'var(--ring-sky-blue-hsl)',
    ringDark: 'var(--ring-sky-blue-hsl-dark)'
  },
  avocadoGreen: { 
    light: 'var(--primary-avocado-green-hsl)', 
    dark: 'var(--primary-avocado-green-hsl-dark)', 
    foreground: 'var(--primary-avocado-green-foreground-hsl)',
    ringLight: 'var(--ring-avocado-green-hsl)',
    ringDark: 'var(--ring-avocado-green-hsl-dark)'
  },
  maroon: { 
    light: 'var(--primary-maroon-hsl)', 
    dark: 'var(--primary-maroon-hsl-dark)', 
    foreground: 'var(--primary-maroon-foreground-hsl)',
    ringLight: 'var(--ring-maroon-hsl)',
    ringDark: 'var(--ring-maroon-hsl-dark)'
  },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [primaryColor, setPrimaryColorState] = useState<PrimaryColor>('purple');
  const [isMounted, setIsMounted] = useState(false);

  const applyThemeStyles = useCallback((currentTheme: Theme, currentColor: PrimaryColor) => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);
    const selectedColorVars = colorVariables[currentColor];
    root.style.setProperty('--primary', currentTheme === 'light' ? selectedColorVars.light : selectedColorVars.dark);
    root.style.setProperty('--primary-foreground', selectedColorVars.foreground);
    root.style.setProperty('--ring', currentTheme === 'light' ? selectedColorVars.ringLight : selectedColorVars.ringDark);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme') as Theme | null;
    const storedColor = localStorage.getItem('app-primary-color') as PrimaryColor | null;
    const initialTheme = storedTheme || 'light';
    const initialColor = storedColor || 'purple';

    setThemeState(initialTheme);
    setPrimaryColorState(initialColor);
    applyThemeStyles(initialTheme, initialColor);
    setIsMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyThemeStyles]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
    if (isMounted) {
      applyThemeStyles(newTheme, primaryColor);
    }
  };

  const setPrimaryColor = (newColor: PrimaryColor) => {
    setPrimaryColorState(newColor);
    localStorage.setItem('app-primary-color', newColor);
    if (isMounted) {
      applyThemeStyles(theme, newColor);
    }
  };
  
  const contextValue = isMounted
    ? { theme, setTheme, primaryColor, setPrimaryColor, isThemeReady: true }
    : defaultThemeContextValue;

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
