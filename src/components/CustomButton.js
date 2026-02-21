import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../utils/theme';

const CustomButton = ({ title, onPress, type = 'primary', loading = false, style, textStyle }) => {
    const isSecondary = type === 'secondary';
    const isOutline = type === 'outline';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                isSecondary && styles.secondaryButton,
                isOutline && styles.outlineButton,
                style,
                loading && styles.disabledButton
            ]}
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={isOutline ? theme.colors.primary : theme.colors.white} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        isOutline && styles.outlineText,
                        textStyle
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        ...theme.shadows.light,
    },
    secondaryButton: {
        backgroundColor: theme.colors.secondary,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.colors.primary,
        elevation: 0,
        shadowOpacity: 0,
    },
    disabledButton: {
        opacity: 0.6,
    },
    text: {
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    outlineText: {
        color: theme.colors.primary,
    },
});

export default CustomButton;
