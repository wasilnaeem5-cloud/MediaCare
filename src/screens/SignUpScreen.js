import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CheckCircle2, Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { authService } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { theme } from '../utils/theme';

const { width, height } = Dimensions.get('window');

const PasswordStrength = ({ password }) => {
    let score = 0;
    if (password.length > 5) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const getWidth = () => {
        if (!password) return '0%';
        return `${(score / 4) * 100}%`;
    };

    const getColor = () => {
        if (score <= 1) return theme.colors.error;
        if (score <= 2) return '#FBBF24'; // Warning
        if (score <= 3) return theme.colors.info;
        return theme.colors.success;
    };

    const getText = () => {
        if (!password) return '';
        if (score <= 1) return 'Weak';
        if (score <= 2) return 'Fair';
        if (score <= 3) return 'Good';
        return 'Strong';
    };

    return (
        <View style={styles.strengthContainer}>
            <View style={styles.strengthBarBg}>
                <Animated.View style={[
                    styles.strengthBarFill,
                    { width: getWidth(), backgroundColor: getColor() }
                ]} />
            </View>
            <Text style={[styles.strengthText, { color: getColor() }]}>{getText()}</Text>
        </View>
    );
};

const SignupScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    // Animations
    const formOpacity = useSharedValue(0);
    const formTranslateY = useSharedValue(40);

    useEffect(() => {
        formOpacity.value = withTiming(1, { duration: 1000 });
        formTranslateY.value = withSpring(0);
    }, []);

    const formAnimatedStyle = useAnimatedStyle(() => ({
        opacity: formOpacity.value,
        transform: [{ translateY: formTranslateY.value }]
    }));

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignUp = async () => {
        const { name, email, phone, password, confirmPassword } = formData;

        if (!name || !email || !phone || !password) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Incomplete Form', 'Please share some details so we can take better care of you. 💜');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Mismatch', 'The passwords do not match. Safety first! 🔐');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.signup({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                password
            });

            const { token, ...userData } = response.data;
            if (token) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                await login(token, userData);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Let\'s try that again.';
            Alert.alert('Registration Issue', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#EEF2FF', '#E0E7FF', '#C7D2FE']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <ArrowLeft color={theme.colors.primary} size={28} />
                        </TouchableOpacity>

                        <Animated.View style={[styles.header, formAnimatedStyle]}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Let’s take care of your health together 💜</Text>
                        </Animated.View>

                        <Animated.View style={[styles.form, formAnimatedStyle]}>
                            <View style={styles.sectionHeader}>
                                <User size={18} color={theme.colors.primary} />
                                <Text style={styles.sectionTitle}>Personal Details</Text>
                            </View>

                            <CustomInput
                                label="Full Name"
                                value={formData.name}
                                onChangeText={(val) => handleChange('name', val)}
                                icon={User}
                            />

                            <CustomInput
                                label="Email Address"
                                value={formData.email}
                                onChangeText={(val) => handleChange('email', val)}
                                icon={Mail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <CustomInput
                                label="Phone Number"
                                value={formData.phone}
                                onChangeText={(val) => handleChange('phone', val)}
                                icon={Phone}
                                keyboardType="phone-pad"
                            />

                            <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                                <Lock size={18} color={theme.colors.primary} />
                                <Text style={styles.sectionTitle}>Security</Text>
                            </View>

                            <CustomInput
                                label="Password"
                                value={formData.password}
                                onChangeText={(val) => handleChange('password', val)}
                                icon={Lock}
                                secureTextEntry
                            />

                            <PasswordStrength password={formData.password} />

                            <CustomInput
                                label="Confirm Password"
                                value={formData.confirmPassword}
                                onChangeText={(val) => handleChange('confirmPassword', val)}
                                icon={Lock}
                                secureTextEntry
                            />

                            <CustomButton
                                title="Ready to Start"
                                onPress={handleSignUp}
                                loading={loading}
                                icon={CheckCircle2}
                            />

                            <View style={styles.securitySeal}>
                                <ShieldCheck size={16} color={theme.colors.textSecondary} />
                                <Text style={styles.securityText}>Secure storage for your medical data 🔒</Text>
                            </View>
                        </Animated.View>

                        <Animated.View style={[styles.footer, formAnimatedStyle]}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.footerLink}>Sign In</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        ...theme.shadows.light,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: theme.colors.text,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginTop: 6,
        fontWeight: '600',
    },
    form: {
        width: '100%',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginLeft: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginLeft: 8,
    },
    strengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -10,
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    strengthBarBg: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    strengthBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    strengthText: {
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 10,
        width: 50,
        textAlign: 'right',
    },
    securitySeal: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    securityText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginLeft: 6,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
        paddingVertical: 10,
    },
    footerText: {
        color: theme.colors.textSecondary,
        fontSize: 15,
        fontWeight: '500',
    },
    footerLink: {
        color: theme.colors.primary,
        fontWeight: '800',
        fontSize: 15,
        textDecorationLine: 'underline',
    },
});

export default SignupScreen;
