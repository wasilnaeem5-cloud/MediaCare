import { createContext, useContext, useEffect, useState } from 'react';
import { storage } from './storage';
import { theme as LightTheme } from './theme';

const ThemeContext = createContext();

// Dark Theme definition
export const DarkTheme = {
    ...LightTheme,
    colors: {
        ...LightTheme.colors,
        background: '#0F172A',
        surface: '#1E293B',
        text: '#F8FAFC',
        textSecondary: '#94A3B8',
        border: '#334155',
        white: '#1E293B', // In dark mode, 'white' surfaces become slate
        softBlue: '#1E293B',
        headerText: '#FFFFFF'
    },
    shadows: {
        light: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 10,
        },
    }
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTheme = async () => {
            const stored = await storage.getThemePreference();
            setIsDarkMode(stored === 'dark');
            setIsLoading(false);
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        await storage.saveThemePreference(newMode ? 'dark' : 'light');
    };

    const value = {
        isDarkMode,
        toggleTheme,
        theme: isDarkMode ? DarkTheme : LightTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {!isLoading && children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
