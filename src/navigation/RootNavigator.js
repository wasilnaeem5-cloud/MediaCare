import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { storage } from '../utils/storage';
import { theme } from '../utils/theme';

import AppointmentConfirmationScreen from '../screens/AppointmentConfirmationScreen';
import FAQHelpScreen from '../screens/FAQHelpScreen';
import ScheduleAppointmentScreen from '../screens/ScheduleAppointmentScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        // Check for token on mount
        const bootstrapAsync = async () => {
            let token;
            try {
                token = await storage.getToken();
            } catch (e) {
                console.error('Failed to load token', e);
            }
            setUserToken(token);
            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {userToken == null ? (
                    // No token found, user isn't signed in
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : (
                    // User is signed in
                    <Stack.Screen name="Main" component={MainNavigator} />
                )}

                {/* Common screens that can be accessed from multiple places or need to be outside tabs */}
                <Stack.Screen name="ScheduleAppointment" component={ScheduleAppointmentScreen} />
                <Stack.Screen name="Confirmation" component={AppointmentConfirmationScreen} />
                <Stack.Screen name="FAQ" component={FAQHelpScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
