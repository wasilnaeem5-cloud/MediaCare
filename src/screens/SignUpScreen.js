import { ArrowLeft, Lock, Mail, Phone, User } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { storage } from '../utils/storage';
import { theme } from '../utils/theme';

const SignUpScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignUp = async () => {
        const { name, email, phone, password, confirmPassword } = formData;

        if (!name || !email || !phone || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            // Mock API call
            // await api.post('/auth/signup', formData);

            setTimeout(async () => {
                const mockToken = 'mock-jwt-token';
                const mockUser = { id: '1', name: name, email: email, phone: phone };

                await storage.saveToken(mockToken);
                await storage.saveUser(mockUser);

                setLoading(false);
                Alert.alert('Success', 'Account created successfully!', [
                    { text: 'OK', onPress: () => navigation.replace('Main') }
                ]);
            }, 1500);
        } catch (error) {
            setLoading(false);
            Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
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
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join MediCare for personalized health management</Text>
                    </View>

                    <View style={styles.form}>
                        <CustomInput
                            label="Full Name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChangeText={(val) => handleChange('name', val)}
                            icon={User}
                        />

                        <CustomInput
                            label="Email Address"
                            placeholder="example@mail.com"
                            value={formData.email}
                            onChangeText={(val) => handleChange('email', val)}
                            icon={Mail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <CustomInput
                            label="Phone Number"
                            placeholder="+1 234 567 890"
                            value={formData.phone}
                            onChangeText={(val) => handleChange('phone', val)}
                            icon={Phone}
                            keyboardType="phone-pad"
                        />

                        <CustomInput
                            label="Password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChangeText={(val) => handleChange('password', val)}
                            icon={Lock}
                            secureTextEntry
                        />

                        <CustomInput
                            label="Confirm Password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChangeText={(val) => handleChange('confirmPassword', val)}
                            icon={Lock}
                            secureTextEntry
                        />

                        <CustomButton
                            title="Sign Up"
                            onPress={handleSignUp}
                            loading={loading}
                            style={styles.signUpButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.footerLink}>Login</Text>
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
    signUpButton: {
        height: 56,
        marginTop: theme.spacing.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.xl,
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

export default SignUpScreen;
