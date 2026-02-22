import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Heart, Lock, Mail, ShieldCheck } from 'lucide-react-native';
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
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import api from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { theme } from '../utils/theme';

const { width, height } = Dimensions.get('window');

const FloatingBlob = ({ color, size, top, left, duration, delay }) => {
    const tx = useSharedValue(0);
    const ty = useSharedValue(0);

    useEffect(() => {
        tx.value = withDelay(delay, withRepeat(withTiming(40, { duration, easing: Easing.inOut(Easing.sin) }), -1, true));
        ty.value = withDelay(delay, withRepeat(withTiming(30, { duration: duration * 1.3, easing: Easing.inOut(Easing.sin) }), -1, true));
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [{ translateX: tx.value }, { translateY: ty.value }]
    }));

    return (
        <Animated.View style={[
            styles.blob,
            { backgroundColor: color, width: size, height: size, borderRadius: size / 2, top, left },
            style
        ]} />
    );
};

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    // Animation Shared Values
    const formOpacity = useSharedValue(0);
    const formTranslateY = useSharedValue(40);
    const shakeTranslateX = useSharedValue(0);

    useEffect(() => {
        formOpacity.value = withTiming(1, { duration: 1000 });
        formTranslateY.value = withSpring(0);
    }, []);

    const formAnimatedStyle = useAnimatedStyle(() => ({
        opacity: formOpacity.value,
        transform: [
            { translateY: formTranslateY.value },
            { translateX: shakeTranslateX.value }
        ]
    }));

    const triggerShake = () => {
        shakeTranslateX.value = withSequence(
            withTiming(-10, { duration: 80 }),
            withTiming(10, { duration: 80 }),
            withTiming(-10, { duration: 80 }),
            withTiming(10, { duration: 80 }),
            withTiming(0, { duration: 80 })
        );
    };

    const handleLogin = async () => {
        if (!email || !password) {
            triggerShake();
            Alert.alert('Empty Fields', 'Please enter your email and password to safely sign in.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: email.trim().toLowerCase(),
                password
            });

            const { token, ...userData } = response.data;

            if (token) {
                await login(token, userData);
            } else {
                throw new Error('No token received');
            }
        } catch (error) {
            triggerShake();
            const message = error.response?.data?.message || 'Invalid email or password. Please try again.';
            Alert.alert('Login Failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F5F3FF', '#EDE9FE', '#DDD6FE']}
                style={StyleSheet.absoluteFill}
            />

            <FloatingBlob color="rgba(94, 96, 206, 0.08)" size={300} top={-50} left={-50} duration={6000} delay={0} />
            <FloatingBlob color="rgba(72, 191, 227, 0.1)" size={200} top={height * 0.6} left={width - 150} duration={8000} delay={1000} />

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
                            <View style={styles.iconCircle}>
                                <Heart size={32} fill={theme.colors.primary} color={theme.colors.primary} />
                            </View>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>We're here to help you stay on track</Text>
                        </Animated.View>

                        <Animated.View style={[styles.form, formAnimatedStyle]}>
                            <CustomInput
                                label="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                icon={Mail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <CustomInput
                                label="Password"
                                value={password}
                                onChangeText={setPassword}
                                icon={Lock}
                                secureTextEntry
                            />

                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                            </TouchableOpacity>

                            <CustomButton
                                title="Sign In"
                                onPress={handleLogin}
                                loading={loading}
                            />

                            <View style={styles.securitySeal}>
                                <ShieldCheck size={16} color={theme.colors.textSecondary} />
                                <Text style={styles.securityText}>Your health data is encrypted and secure 🔒</Text>
                            </View>
                        </Animated.View>

                        <Animated.View style={[styles.footer, formAnimatedStyle]}>
                            <Text style={styles.footerText}>New to MediCare? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={styles.footerLink}>Create Account</Text>
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
    blob: {
        position: 'absolute',
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
        alignItems: 'center',
        marginBottom: 40,
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        ...theme.shadows.light,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: theme.colors.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '500',
    },
    form: {
        width: '100%',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotPasswordText: {
        color: theme.colors.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    securitySeal: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
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
        marginTop: 'auto',
        paddingVertical: 30,
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

export default LoginScreen;
