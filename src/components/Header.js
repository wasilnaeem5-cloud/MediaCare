import { Bell, User } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { theme } from '../utils/theme';

const Header = ({ title, user, onProfilePress, onNotificationPress }) => {
    const bellScale = useSharedValue(1);
    const pulseAnim = useSharedValue(1);

    useEffect(() => {
        pulseAnim.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
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
        opacity: interpolate(pulseAnim.value, [1, 1.2], [0.6, 0.2])
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
                <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Healthier'}!</Text>
            </View>

            <View style={styles.rightSection}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleBellPress}
                    activeOpacity={0.7}
                >
                    <Animated.View style={animatedBellStyle}>
                        <Bell size={24} color={theme.colors.text} />
                    </Animated.View>
                    <View style={styles.badge} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.profileContainer}
                    onPress={onProfilePress}
                    activeOpacity={0.8}
                >
                    <Animated.View style={[styles.glowRing, glowStyle]} />
                    <View style={styles.avatar}>
                        {user?.avatar ? (
                            <Text>Avatar</Text> // Placeholder for Image
                        ) : (
                            <User size={22} color={theme.colors.primary} />
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Helper function needed for glowStyle
const interpolate = (value, inputRange, outputRange) => {
    'worklet';
    const [minIn, maxIn] = inputRange;
    const [minOut, maxOut] = outputRange;
    return minOut + (value - minIn) * (maxOut - minOut) / (maxIn - minIn);
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
        backgroundColor: 'transparent',
    },
    leftSection: {
        justifyContent: 'center',
    },
    greetingText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        marginBottom: 2,
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: theme.colors.text,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        ...theme.shadows.light,
    },
    badge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.error,
        borderWidth: 2,
        borderColor: theme.colors.white,
    },
    profileContainer: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glowRing: {
        position: 'absolute',
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.softBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.white,
        zIndex: 1,
    },
});

export default Header;
