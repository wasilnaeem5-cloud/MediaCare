import { createContext, useContext, useEffect, useState } from 'react';
import { storage } from './storage';

const AuthContext = createContext();

// Global reference to logout function for non-component files (like api.js)
let globalLogout = () => { };

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const token = await storage.getToken();
                const storedUser = await storage.getUser();

                if (token === 'mock-jwt-token' || !token) {
                    await storage.clearAll();
                    setUserToken(null);
                    setUser(null);
                } else {
                    setUserToken(token);
                    setUser(storedUser);
                }
            } catch (e) {
                console.error('Failed to load auth data', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredData();
        globalLogout = logout;
    }, []);

    const login = async (token, userData) => {
        try {
            await storage.saveToken(token);
            await storage.saveUser(userData);
            setUserToken(token);
            setUser(userData);
            console.log('[AuthContext] Login successful');
        } catch (error) {
            console.error('[AuthContext] Login error', error);
        }
    };

    const logout = async () => {
        try {
            setUserToken(null);
            setUser(null);
            await storage.clearAll();
            console.log('[AuthContext] Session cleared');
        } catch (error) {
            console.error('[AuthContext] Logout error', error);
        }
    };

    const updateUser = async (newUserData) => {
        try {
            const updatedUser = { ...user, ...newUserData };
            await storage.saveUser(updatedUser);
            setUser(updatedUser);
        } catch (error) {
            console.error('[AuthContext] Update user error', error);
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, user, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const logoutGlobally = () => globalLogout();
export const useAuth = () => useContext(AuthContext);

