import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Calendar, FileText, Home, Pill, User } from 'lucide-react-native';
import { useEffect } from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring
} from 'react-native-reanimated';
import { useTheme } from '../utils/ThemeContext';

import AppointmentsScreen from '../screens/AppointmentsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MedicalRecordsScreen from '../screens/MedicalRecordsScreen';
import MedicationScreen from '../screens/MedicationScreen';
import ProfileSettingScreen from '../screens/ProfileSettingScreen';

const Tab = createBottomTabNavigator();

const AnimatedTabIcon = ({ Icon, focused, color, size }) => {
    const scale = useSharedValue(1);

    useEffect(() => {
        if (focused) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            scale.value = withSequence(
                withSpring(1.3, { damping: 10, stiffness: 100 }),
                withSpring(1)
            );
        }
    }, [focused]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <Animated.View style={animatedStyle}>
            <Icon size={size} color={color} fill={focused ? color + '20' : 'transparent'} />
        </Animated.View>
    );
};

const MainNavigator = () => {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let Icon;
                    if (route.name === 'Home') Icon = Home;
                    else if (route.name === 'Appointments') Icon = Calendar;
                    else if (route.name === 'Records') Icon = FileText;
                    else if (route.name === 'Meds') Icon = Pill;
                    else if (route.name === 'Profile') Icon = User;

                    return <AnimatedTabIcon Icon={Icon} focused={focused} color={color} size={size} />;
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarStyle: {
                    paddingBottom: 10,
                    paddingTop: 10,
                    height: 75,
                    borderTopWidth: 0,
                    backgroundColor: theme.colors.surface, // Use surface for theme compatibility
                    ...theme.shadows.medium,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '800',
                    marginTop: 4,
                },
            })}
        >
            <Tab.Screen name="Home" component={DashboardScreen} />
            <Tab.Screen name="Appointments" component={AppointmentsScreen} />
            <Tab.Screen name="Records" component={MedicalRecordsScreen} />
            <Tab.Screen name="Meds" component={MedicationScreen} />
            <Tab.Screen name="Profile" component={ProfileSettingScreen} />
        </Tab.Navigator>
    );
};

export default MainNavigator;
