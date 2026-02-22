import { Eye, EyeOff } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { theme } from '../utils/theme';

const CustomInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType = 'default',
    error,
    icon: Icon,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Animation for floating label
    const labelAnim = useSharedValue(value ? 1 : 0);

    useEffect(() => {
        labelAnim.value = withTiming(isFocused || value ? 1 : 0, { duration: 200 });
    }, [isFocused, value]);

    const labelStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: interpolate(labelAnim.value, [0, 1], [0, -28]) },
                { scale: interpolate(labelAnim.value, [0, 1], [1, 0.85]) }
            ],
            color: interpolate(labelAnim.value, [0, 1], [0, 1]) === 1
                ? theme.colors.primary
                : theme.colors.textSecondary,
        };
    });

    const borderStyle = useAnimatedStyle(() => ({
        borderColor: withTiming(
            error ? theme.colors.error : (isFocused ? theme.colors.primary : theme.colors.border),
            { duration: 200 }
        ),
        borderWidth: withTiming(isFocused ? 2 : 1.5, { duration: 200 }),
        backgroundColor: withTiming(isFocused ? theme.colors.white : 'rgba(255,255,255,0.7)', { duration: 200 }),
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.inputWrapper, borderStyle]}>
                {Icon && <Icon size={20} color={isFocused ? theme.colors.primary : theme.colors.textSecondary} style={styles.icon} />}

                <View style={styles.textInputContainer}>
                    <Animated.Text style={[styles.floatingLabel, labelStyle]}>
                        {label}
                    </Animated.Text>
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChangeText}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        secureTextEntry={secureTextEntry && !showPassword}
                        keyboardType={keyboardType}
                        selectionColor={theme.colors.primary}
                        placeholder={isFocused ? placeholder : ""}
                        placeholderTextColor={theme.colors.textSecondary}
                        {...props}
                    />
                </View>

                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeBtn}
                    >
                        {showPassword ? (
                            <EyeOff size={20} color={theme.colors.textSecondary} />
                        ) : (
                            <Eye size={20} color={theme.colors.textSecondary} />
                        )}
                    </TouchableOpacity>
                )}
            </Animated.View>
            {error && <Animated.Text style={styles.errorText}>{error}</Animated.Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 64,
        borderRadius: 18,
        paddingHorizontal: 16,
        ...theme.shadows.light,
    },
    textInputContainer: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
    },
    floatingLabel: {
        position: 'absolute',
        left: 0,
        fontWeight: '600',
        fontSize: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text,
        fontWeight: '500',
        paddingTop: 14, // Leave space for label
    },
    icon: {
        marginRight: 12,
    },
    eyeBtn: {
        padding: 4,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 12,
        marginTop: 6,
        marginLeft: 12,
        fontWeight: '600',
    },
});

export default CustomInput;
