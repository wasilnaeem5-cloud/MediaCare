import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { useTheme } from '../utils/ThemeContext';

const CustomButton = ({
    title,
    onPress,
    type = 'primary',
    loading = false,
    style,
    textStyle,
    icon: Icon
}) => {
    const { theme } = useTheme();
    const scale = useSharedValue(1);
    const isOutline = type === 'outline';

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const handlePress = () => {
        if (loading) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withSequence(
            withTiming(0.96, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );
        onPress && onPress();
    };

    const ButtonContent = () => (
        <View style={styles.content}>
            {loading ? (
                <ActivityIndicator color={isOutline ? theme.colors.primary : "#FFF"} />
            ) : (
                <>
                    <Text style={[
                        styles.text,
                        { color: "#FFF" },
                        isOutline && { color: theme.colors.primary },
                        textStyle
                    ]}>
                        {title}
                    </Text>
                    {Icon && <Icon size={20} color="#FFF" style={styles.icon} />}
                </>
            )}
        </View>
    );

    return (
        <Animated.View style={[styles.container, animatedStyle, style]}>
            <TouchableOpacity
                onPress={handlePress}
                disabled={loading}
                activeOpacity={0.9}
                style={styles.touchable}
            >
                {isOutline ? (
                    <View style={[styles.button, styles.outlineButton, { borderColor: theme.colors.primary }]}>
                        <ButtonContent />
                    </View>
                ) : (
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.accent]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <ButtonContent />
                    </LinearGradient>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 60,
        borderRadius: 20,
        overflow: 'hidden',
    },
    touchable: {
        flex: 1,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: '800',
    },
    icon: {
        marginLeft: 10,
    },
});

export default CustomButton;
