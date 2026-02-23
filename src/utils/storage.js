import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@medicare_token';
const USER_KEY = '@medicare_user';

export const storage = {
  saveToken: async (token) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token', error);
    }
  },
  getToken: async () => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token', error);
      return null;
    }
  },
  removeToken: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token', error);
    }
  },
  saveUser: async (user) => {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user', error);
    }
  },
  getUser: async () => {
    try {
      const user = await AsyncStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user', error);
      return null;
    }
  },
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage', error);
    }
  },
  saveThemePreference: async (theme) => {
    try {
      await AsyncStorage.setItem('@medicare_theme', theme);
    } catch (error) {
      console.error('Error saving theme', error);
    }
  },
  getThemePreference: async () => {
    try {
      return await AsyncStorage.getItem('@medicare_theme');
    } catch (error) {
      console.error('Error getting theme', error);
      return 'light';
    }
  }
};
