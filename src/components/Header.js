import { Bell, User } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../utils/theme';

const Header = ({ title, showProfile = true, onProfilePress }) => {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.iconButton}>
                    <Bell size={24} color={theme.colors.text} />
                    <View style={styles.badge} />
                </TouchableOpacity>
                {showProfile && (
                    <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
                        <User size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.background,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: theme.colors.text,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: theme.spacing.sm,
        marginRight: theme.spacing.xs,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.error,
        borderWidth: 1,
        borderColor: theme.colors.background,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.softBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing.xs,
    },
});

export default Header;
