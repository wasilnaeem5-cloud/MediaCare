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
import { authService } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';

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
    const { theme, isDarkMode } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

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
            Alert.alert('Selection Required', 'Please enter your email and password.');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login({
                email: email.trim().toLowerCase(),
                password
            });
            const { token, ...userData } = response.data;
            if (token) {
                await login(token, userData);
            }
        } catch (error) {
            triggerShake();
            Alert.alert('Login Failed', error.response?.data?.message || 'Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <LinearGradient
                colors={isDarkMode ? ['#0F172A', '#1E293B', '#111827'] : ['#F5F3FF', '#EDE9FE', '#DDD6FE']}
                style={StyleSheet.absoluteFill}
            />

            <FloatingBlob color={isDarkMode ? 'rgba(99, 102, 241, 0.05)' : 'rgba(94, 96, 206, 0.08)'} size={300} top={-50} left={-50} duration={6000} delay={0} />

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.colors.surface }]} onPress={() => navigation.goBack()}>
                            <ArrowLeft color={theme.colors.primary} size={28} />
                        </TouchableOpacity>

                        <Animated.View style={[styles.header, formAnimatedStyle]}>
                            <View style={[styles.iconCircle, { backgroundColor: theme.colors.surface }]}>
                                <Heart size={32} fill={theme.colors.primary} color={theme.colors.primary} />
                            </View>
                            <Text style={[styles.title, { color: theme.colors.text }]}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Log in to manage your health journey</Text>
                        </Animated.View>

                        <Animated.View style={[styles.form, formAnimatedStyle]}>
                            <CustomInput label="Email" value={email} onChangeText={setEmail} icon={Mail} keyboardType="email-address" />
                            <CustomInput label="Password" value={password} onChangeText={setPassword} icon={Lock} secureTextEntry />

                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>Forgot password?</Text>
                            </TouchableOpacity>

                            <CustomButton title="Sign In" onPress={handleLogin} loading={loading} />

                            <View style={styles.securitySeal}>
                                <ShieldCheck size={16} color="#94A3B8" />
                                <Text style={styles.securityText}>Secure authentication with 256-bit encryption</Text>
                            </View>
                        </Animated.View>

                        <Animated.View style={[styles.footer, formAnimatedStyle]}>
                            <Text style={styles.footerText}>New to MediCare? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={[styles.footerLink, { color: theme.colors.primary }]}>Create Account</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    blob: { position: 'absolute' },
    scrollContent: { flexGrow: 1, paddingHorizontal: 25, paddingBottom: 30 },
    backButton: { width: 48, height: 48, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 2 },
    header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
    iconCircle: { width: 80, height: 80, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 4 },
    title: { fontSize: 32, fontWeight: '900', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#94A3B8', textAlign: 'center', marginTop: 8, fontWeight: '500' },
    form: { width: '100%' },
    forgotPassword: { alignSelf: 'flex-end', marginBottom: 25 },
    forgotPasswordText: { fontWeight: '700', fontSize: 14 },
    securitySeal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 25 },
    securityText: { fontSize: 12, color: '#94A3B8', marginLeft: 8, fontWeight: '500' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', paddingVertical: 30 },
    footerText: { color: '#94A3B8', fontSize: 15, fontWeight: '500' },
    footerLink: { fontWeight: '800', fontSize: 15, textDecorationLine: 'underline' },
});

export default LoginScreen;
