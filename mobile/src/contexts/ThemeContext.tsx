import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, Provider } from 'react-native-paper';

// RenThing Custom Theme Colors
const rentThingColors = {
  primary: '#2563eb', // Blue from web version
  primaryContainer: '#dbeafe',
  secondary: '#16a34a', // Green
  secondaryContainer: '#dcfce7',
  tertiary: '#9333ea', // Purple
  tertiaryContainer: '#f3e8ff',
  surface: '#ffffff',
  surfaceVariant: '#f1f5f9',
  background: '#ffffff',
  error: '#dc2626',
  errorContainer: '#fef2f2',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#1e40af',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#15803d',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#7c3aed',
  onSurface: '#1f2937',
  onSurfaceVariant: '#6b7280',
  onBackground: '#1f2937',
  onError: '#ffffff',
  onErrorContainer: '#b91c1c',
};

const rentThingDarkColors = {
  ...rentThingColors,
  surface: '#1f2937',
  surfaceVariant: '#374151',
  background: '#111827',
  onSurface: '#f9fafb',
  onSurfaceVariant: '#d1d5db',
  onBackground: '#f9fafb',
};

const rentThingLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...rentThingColors,
  },
};

const rentThingDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...rentThingDarkColors,
  },
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? rentThingDarkTheme : rentThingLightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <Provider theme={theme}>
        {children}
      </Provider>
    </ThemeContext.Provider>
  );
}