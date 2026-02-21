import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calendar, FileText, Home, User } from 'lucide-react-native';
import { theme } from '../utils/theme';

import AppointmentsScreen from '../screens/AppointmentsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MedicalRecordsScreen from '../screens/MedicalRecordsScreen';
import ProfileSettingScreen from '../screens/ProfileSettingScreen';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = Home;
                    else if (route.name === 'Appointments') iconName = Calendar;
                    else if (route.name === 'Records') iconName = FileText;
                    else if (route.name === 'Profile') iconName = User;

                    const Icon = iconName;
                    return <Icon size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                    backgroundColor: theme.colors.white,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            })}
        >
            <Tab.Screen name="Home" component={DashboardScreen} />
            <Tab.Screen name="Appointments" component={AppointmentsScreen} />
            <Tab.Screen name="Records" component={MedicalRecordsScreen} />
            <Tab.Screen name="Profile" component={ProfileSettingScreen} />
        </Tab.Navigator>
    );
};

export default MainNavigator;
