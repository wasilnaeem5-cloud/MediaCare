import { Bell, User } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { useTheme } from '../utils/ThemeContext';

const Header = ({ title, user, onProfilePress, onNotificationPress }) => {
    const { theme, isDarkMode } = useTheme();
    const bellScale = useSharedValue(1);
    const pulseAnim = useSharedValue(1);

    useEffect(() => {
        pulseAnim.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 1500 }),
                withTiming(1, { duration: 1500 })
            ),
            -1,
            true
        );
    }, []);

    const animatedBellStyle = useAnimatedStyle(() => ({
        transform: [{ scale: bellScale.value }]
    }));

    const glowStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseAnim.value }],
        opacity: interpolate(pulseAnim.value, [1, 1.2], [0.4, 0.1])
    }));

    const handleBellPress = () => {
        bellScale.value = withSequence(
            withTiming(1.3, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );
        onNotificationPress && onNotificationPress();
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getGreetingEmoji = () => {
        const hour = new Date().getHours();
        if (hour < 12) return '🌿';
        if (hour < 17) return '🌤️';
        return '🌙';
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <Text style={styles.greetingText}>{getGreeting()} {getGreetingEmoji()}</Text>
                <Text style={[styles.userName, { color: theme.colors.text }]}>
                    {user?.name?.split(' ')[0] || 'Healthier'}!
                </Text>
            </View>

            <View style={styles.rightSection}>
                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}
                    onPress={handleBellPress}
                    activeOpacity={0.7}
                >
                    <Animated.View style={animatedBellStyle}>
                        <Bell size={22} color={theme.colors.text} />
                    </Animated.View>
                    <View style={styles.badge} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.profileContainer}
                    onPress={onProfilePress}
                    activeOpacity={0.8}
                >
                    <Animated.View style={[styles.glowRing, { backgroundColor: theme.colors.primary }, glowStyle]} />
                    <View style={[styles.avatar, { backgroundColor: theme.colors.softBlue, borderColor: theme.colors.surface }]}>
                        <User size={22} color={theme.colors.primary} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'transparent',
    },
    leftSection: {
        justifyContent: 'center',
    },
    greetingText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#94A3B8',
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    userName: {
        fontSize: 24,
        fontWeight: '900',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        elevation: 2,
    },
    badge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    profileContainer: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glowRing: {
        position: 'absolute',
        width: 52,
        height: 52,
        borderRadius: 26,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        zIndex: 1,
    },
});

export default Header;
