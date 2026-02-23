import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { useTheme } from '../utils/ThemeContext';

const Skeleton = ({ width, height, borderRadius = 8, style }) => {
    const { theme, isDarkMode } = useTheme();
    const opacity = useSharedValue(isDarkMode ? 0.3 : 0.6);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(isDarkMode ? 0.1 : 0.3, { duration: 1000 }),
                withTiming(isDarkMode ? 0.3 : 0.6, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: isDarkMode ? '#1E293B' : '#E2E8F0'
                },
                animatedStyle,
                style
            ]}
        />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#E2E8F0',
    },
});

export default Skeleton;
