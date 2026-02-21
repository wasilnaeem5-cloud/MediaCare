import { ArrowLeft, Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { storage } from '../utils/storage';
import { theme } from '../utils/theme';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // Mock API call
            // const response = await api.post('/auth/login', { email, password });
            // const { token, user } = response.data;

            // Simulating success for now
            setTimeout(async () => {
                const mockToken = 'mock-jwt-token';
                const mockUser = { id: '1', name: 'John Doe', email: email };

                await storage.saveToken(mockToken);
                await storage.saveUser(mockUser);

                setLoading(false);
                navigation.replace('Main');
            }, 1500);
        } catch (error) {
            setLoading(false);
            Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
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
