import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';

import AddMedicationScreen from '../screens/AddMedicationScreen';
import AdminDashboard from '../screens/AdminDashboard';
import AppointmentConfirmationScreen from '../screens/AppointmentConfirmationScreen';
import FAQHelpScreen from '../screens/FAQHelpScreen';
import MedicationScreen from '../screens/MedicationScreen';
import ScheduleAppointmentScreen from '../screens/ScheduleAppointmentScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { userToken, isLoading, user } = useAuth();
    const { theme } = useTheme();

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
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : user?.role === 'admin' ? (
                    <Stack.Screen name="AdminMain" component={AdminDashboard} />
                ) : (
                    <>
                        <Stack.Screen name="Main" component={MainNavigator} />
                        <Stack.Screen name="ScheduleAppointment" component={ScheduleAppointmentScreen} />
                        <Stack.Screen name="Confirmation" component={AppointmentConfirmationScreen} />
                        <Stack.Screen name="Medications" component={MedicationScreen} />
                        <Stack.Screen name="AddMedication" component={AddMedicationScreen} />
                        <Stack.Screen name="FAQ" component={FAQHelpScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
