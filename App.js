import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/utils/AuthContext';
import { ThemeProvider } from './src/utils/ThemeContext';

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AuthProvider>
                    <StatusBar style="auto" />
                    <RootNavigator />
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
