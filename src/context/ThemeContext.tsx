
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type Theme = 'light' | 'dark';
export type PrimaryColor = 'purple' | 'skyBlue' | 'avocadoGreen' | 'maroon';
export type FontStyle = 'default' | 'modern' | 'classic';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  primaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
  fontStyle: FontStyle;
  setFontStyle: (font: FontStyle) => void;
  isThemeReady: boolean;
}

const defaultThemeContextValue: ThemeContextValue = {
  theme: 'light',
  setTheme: () => console.warn('ThemeProvider not yet ready or mounted'),
  primaryColor: 'purple',
  setPrimaryColor: () => console.warn('ThemeProvider not yet ready or mounted'),
  fontStyle: 'default',
  setFontStyle: () => console.warn('ThemeProvider not yet ready or mounted'),
  isThemeReady: false,
};

const ThemeContext = createContext<ThemeContextValue>(defaultThemeContextValue);

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
  const [fontStyle, setFontStyleState] = useState<FontStyle>('default');
  const [isThemeReady, setIsThemeReady] = useState(false);

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

  const applyFontStyle = useCallback((currentFont: FontStyle) => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    root.classList.remove('font-default', 'font-modern', 'font-classic');
    root.classList.add(`font-${currentFont}`);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme') as Theme | null;
    const storedColor = localStorage.getItem('app-primary-color') as PrimaryColor | null;
    const storedFont = localStorage.getItem('app-font-style') as FontStyle | null;
    const initialTheme = storedTheme || 'light';
    const initialColor = storedColor || 'purple';
    const initialFont = storedFont || 'default';

    setThemeState(initialTheme);
    setPrimaryColorState(initialColor);
    setFontStyleState(initialFont);
    applyThemeStyles(initialTheme, initialColor);
    applyFontStyle(initialFont);
    setIsThemeReady(true);
  }, [applyThemeStyles, applyFontStyle]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
    if (isThemeReady) {
      applyThemeStyles(newTheme, primaryColor);
    }
  };

  const setPrimaryColor = (newColor: PrimaryColor) => {
    setPrimaryColorState(newColor);
    localStorage.setItem('app-primary-color', newColor);
    if (isThemeReady) {
      applyThemeStyles(theme, newColor);
    }
  };

  const setFontStyle = (newFont: FontStyle) => {
    setFontStyleState(newFont);
    localStorage.setItem('app-font-style', newFont);
    if (isThemeReady) {
      applyFontStyle(newFont);
    }
  };
  
  const contextValue = { 
    theme, 
    setTheme, 
    primaryColor, 
    setPrimaryColor, 
    fontStyle,
    setFontStyle,
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
   if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
