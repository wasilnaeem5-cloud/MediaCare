import { ArrowLeft, Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import api from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { theme } from '../utils/theme';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        console.log('[Login] Attempting login for:', email);

        try {
            const response = await api.post('/auth/login', {
                email: email.trim().toLowerCase(),
                password
            });

            const { token, ...userData } = response.data;

            if (token) {
                console.log('[Login] Success, received token');
                await login(token, userData);
                // RootNavigator will automatically transition to 'Main'
            } else {
                throw new Error('No token received from server');
            }
        } catch (error) {
            console.error('[Login Error]', error);
            const message = error.response?.data?.message || 'Invalid email or password';
            Alert.alert('Login Failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowLeft color={theme.colors.text} size={24} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue your healthcare journey</Text>
                    </View>

                    <View style={styles.form}>
                        <CustomInput
                            label="Email Address"
                            placeholder="example@mail.com"
                            value={email}
                            onChangeText={setEmail}
                            icon={Mail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <CustomInput
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            icon={Lock}
                            secureTextEntry
                        />

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <CustomButton
                            title="Login"
                            onPress={handleLogin}
                            loading={loading}
                            style={styles.loginButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.footerLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: theme.spacing.lg,
    },
    backButton: {
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    header: {
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    form: {
        marginTop: theme.spacing.md,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: theme.spacing.xl,
    },
    forgotPasswordText: {
        color: theme.colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    loginButton: {
        height: 56,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingVertical: theme.spacing.lg,
    },
    footerText: {
        color: theme.colors.textSecondary,
        fontSize: 15,
    },
    footerLink: {
        color: theme.colors.primary,
        fontWeight: '700',
        fontSize: 15,
    },
});

export default LoginScreen;
