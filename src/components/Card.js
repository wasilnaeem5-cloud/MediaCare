import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

const Card = ({ children, style, onPress, variant = 'elevated' }) => {
    const { theme } = useTheme();
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.card,
                { backgroundColor: theme.colors.surface },
                variant === 'elevated' && theme.shadows.light,
                variant === 'outline' && { borderWidth: 1, borderColor: theme.colors.border },
                style,
            ]}
        >
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
    },
});

export default Card;
