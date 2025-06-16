
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type Theme = 'light' | 'dark';
export type PrimaryColor = 'purple' | 'skyBlue' | 'avocadoGreen' | 'maroon';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  primaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
  isThemeReady: boolean;
}

const defaultThemeContextValue: ThemeContextValue = {
  theme: 'light',
  setTheme: () => console.warn('ThemeProvider not yet ready or mounted'),
  primaryColor: 'purple',
  setPrimaryColor: () => console.warn('ThemeProvider not yet ready or mounted'),
  isThemeReady: false,
};

const ThemeContext = createContext<ThemeContextValue>(defaultThemeContextValue);

// Maps PrimaryColor names to their CSS variable names defined in globals.css
const colorVarMap: Record<PrimaryColor, { light: string; dark: string; foreground: string; ringLight: string; ringDark: string }> = {
  purple: { 
    light: 'var(--primary-purple-hsl)', 
    dark: 'var(--primary-purple-hsl-dark)', 
    foreground: 'var(--primary-purple-foreground-hsl)',
    ringLight: 'var(--ring-purple-hsl)',
    ringDark: 'var(--ring-purple-hsl-dark)'
  },
  skyBlue: { 
    light: 'var(--primary-skyBlue-hsl)', 
    dark: 'var(--primary-skyBlue-hsl-dark)', 
    foreground: 'var(--primary-skyBlue-foreground-hsl)',
    ringLight: 'var(--ring-skyBlue-hsl)',
    ringDark: 'var(--ring-skyBlue-hsl-dark)'
  },
  avocadoGreen: { 
    light: 'var(--primary-avocadoGreen-hsl)', 
    dark: 'var(--primary-avocadoGreen-hsl-dark)', 
    foreground: 'var(--primary-avocadoGreen-foreground-hsl)',
    ringLight: 'var(--ring-avocadoGreen-hsl)',
    ringDark: 'var(--ring-avocadoGreen-hsl-dark)'
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
  const [isThemeReady, setIsThemeReady] = useState(false); // Changed from isMounted

  const applyThemeStyles = useCallback((currentTheme: Theme, currentColor: PrimaryColor) => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);

    const selectedColorSet = colorVarMap[currentColor];
    root.style.setProperty('--primary', currentTheme === 'light' ? selectedColorSet.light : selectedColorSet.dark);
    root.style.setProperty('--primary-foreground', selectedColorSet.foreground);
    root.style.setProperty('--ring', currentTheme === 'light' ? selectedColorSet.ringLight : selectedColorSet.ringDark);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme') as Theme | null;
    const storedColor = localStorage.getItem('app-primary-color') as PrimaryColor | null;
    const initialTheme = storedTheme || 'light';
    const initialColor = storedColor || 'purple';

    setThemeState(initialTheme);
    setPrimaryColorState(initialColor);
    applyThemeStyles(initialTheme, initialColor);
    setIsThemeReady(true); // Set ready after initial application
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyThemeStyles]); // applyThemeStyles is stable due to useCallback

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
    if (isThemeReady) { // Apply only if initial setup is done
      applyThemeStyles(newTheme, primaryColor);
    }
  };

  const setPrimaryColor = (newColor: PrimaryColor) => {
    setPrimaryColorState(newColor);
    localStorage.setItem('app-primary-color', newColor);
    if (isThemeReady) { // Apply only if initial setup is done
      applyThemeStyles(theme, newColor);
    }
  };
  
  const contextValue = { 
    theme, 
    setTheme, 
    primaryColor, 
    setPrimaryColor, 
    isThemeReady 
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
   if (context === undefined) { // Check for undefined instead of comparing to default
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
