import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '../utils/theme';

const Card = ({ children, style, onPress, variant = 'elevated' }) => {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.card,
                variant === 'elevated' && styles.elevated,
                variant === 'outline' && styles.outline,
                style,
            ]}
        >
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    elevated: {
        ...theme.shadows.light,
    },
    outline: {
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
});

export default Card;
