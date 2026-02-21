import { LinearGradient } from 'expo-linear-gradient';
import { HeartPulse } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { theme } from '../utils/theme';

const WelcomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[theme.colors.softBlue, theme.colors.background]}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <View style={styles.logoContainer}>
                        <View style={styles.iconCircle}>
                            <HeartPulse size={80} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.title}>MediCare</Text>
                        <Text style={styles.subtitle}>Your Health, Our Priority</Text>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.description}>
                            The best way to manage your medical appointments and records in one place.
                        </Text>

                        <CustomButton
                            title="Get Started"
                            onPress={() => navigation.navigate('Login')}
                            style={styles.button}
                        />

                        <TouchableOpacity
                            onPress={() => navigation.navigate('SignUp')}
                            style={styles.linkButton}
                        >
                            <Text style={styles.linkText}>
                                Don't have an account? <Text style={styles.linkHighlight}>Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: theme.spacing.xl,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        ...theme.shadows.medium,
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: theme.colors.primary,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 18,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
        fontWeight: '500',
    },
    footer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    description: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.md,
        lineHeight: 24,
    },
    button: {
        height: 56,
    },
    linkButton: {
        marginTop: theme.spacing.lg,
    },
    linkText: {
        fontSize: 15,
        color: theme.colors.textSecondary,
    },
    linkHighlight: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
});

export default WelcomeScreen;
