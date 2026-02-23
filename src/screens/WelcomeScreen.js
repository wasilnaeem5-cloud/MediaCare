import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Calendar, FileText, Heart, ShieldCheck } from 'lucide-react-native';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { useTheme } from '../utils/ThemeContext';

const { width, height } = Dimensions.get('window');

const FeatureItem = ({ icon: Icon, title, delay }) => {
    const { theme } = useTheme();
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    useEffect(() => {
        opacity.value = withDelay(delay, withTiming(1, { duration: 800 }));
        translateY.value = withDelay(delay, withSpring(0));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View style={[styles.featureItem, animatedStyle]}>
            <View style={[styles.featureIconContainer, { backgroundColor: theme.colors.primary + '1F' }]}>
                <Icon size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.featureText, { color: theme.colors.text }]}>{title}</Text>
        </Animated.View>
    );
};

const FloatingBlob = ({ color, size, top, left, duration, delay }) => {
    const tx = useSharedValue(0);
    const ty = useSharedValue(0);

    useEffect(() => {
        tx.value = withDelay(delay, withRepeat(withTiming(30, { duration, easing: Easing.inOut(Easing.sin) }), -1, true));
        ty.value = withDelay(delay, withRepeat(withTiming(40, { duration: duration * 1.2, easing: Easing.inOut(Easing.sin) }), -1, true));
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [
            { translateX: tx.value },
            { translateY: ty.value }
        ]
    }));

    return (
        <Animated.View style={[
            styles.blob,
            { backgroundColor: color, width: size, height: size, borderRadius: size / 2, top, left },
            style
        ]} />
    );
};

const WelcomeScreen = ({ navigation }) => {
    const { theme, isDarkMode } = useTheme();
    const logoScale = useSharedValue(0.8);
    const logoOpacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);
    const textTranslateY = useSharedValue(30);
    const pulseScale = useSharedValue(1);
    const buttonScale = useSharedValue(1);

    useEffect(() => {
        logoScale.value = withSpring(1);
        logoOpacity.value = withTiming(1, { duration: 1000 });
        textOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
        textTranslateY.value = withDelay(400, withSpring(0));
        pulseScale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 100, easing: Easing.out(Easing.quad) }),
                withTiming(1, { duration: 100 }),
                withTiming(1.15, { duration: 100 }),
                withTiming(1, { duration: 600 })
            ),
            -1,
            false
        );
    }, []);

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }]
    }));

    const textAnimatedStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: textTranslateY.value }]
    }));

    const heartPulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }]
    }));

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }]
    }));

    const handleGetStarted = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        buttonScale.value = withSequence(
            withTiming(0.95, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );
        setTimeout(() => {
            navigation.navigate('Login');
        }, 200);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <LinearGradient
                colors={isDarkMode ? ['#0F172A', '#1E293B', '#111827'] : ['#EEF2FF', '#E0E7FF', '#C7D2FE']}
                style={StyleSheet.absoluteFill}
            />

            <FloatingBlob color={isDarkMode ? 'rgba(99, 102, 241, 0.05)' : 'rgba(94, 96, 206, 0.1)'} size={200} top={-50} left={-50} duration={4000} delay={0} />
            <FloatingBlob color={isDarkMode ? 'rgba(72, 191, 227, 0.08)' : 'rgba(72, 191, 227, 0.15)'} size={150} top={height * 0.4} left={width - 100} duration={5000} delay={500} />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.topContent}>
                    <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.colors.surface }]}>
                            <Animated.View style={heartPulseStyle}>
                                <Heart size={64} fill={theme.colors.primary} color={theme.colors.primary} />
                            </Animated.View>
                        </View>
                    </Animated.View>

                    <Animated.View style={[styles.textWrapper, textAnimatedStyle]}>
                        <Text style={[styles.title, { color: theme.colors.text }]}>MediCare</Text>
                        <Text style={[styles.subtitle, { color: theme.colors.primary }]}>Smart Healthcare, Better Life</Text>
                    </Animated.View>

                    <View style={styles.featuresContainer}>
                        <FeatureItem icon={Calendar} title="Easy Booking" delay={800} />
                        <FeatureItem icon={FileText} title="Digital Records" delay={1000} />
                        <FeatureItem icon={ShieldCheck} title="Secure & Private" delay={1200} />
                    </View>
                </View>

                <View style={styles.bottomContent}>
                    <Text style={styles.description}>
                        Experience the next generation of healthcare management. All your medical needs in one smart platform.
                    </Text>

                    <Animated.View style={[styles.buttonWrapper, buttonAnimatedStyle]}>
                        <TouchableOpacity onPress={handleGetStarted} activeOpacity={0.9} style={styles.mainButton}>
                            <LinearGradient
                                colors={[theme.colors.primary, theme.colors.accent]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.buttonText}>Get Started</Text>
                                <View style={styles.arrowIcon}>
                                    <ArrowRight size={20} color="#FFF" />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>
                            Don't have an account? <Text style={[styles.signUpHighlight, { color: theme.colors.primary }]}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    blob: { position: 'absolute' },
    safeArea: { flex: 1 },
    topContent: { flex: 1, alignItems: 'center', paddingTop: height * 0.08 },
    logoWrapper: { marginBottom: 20 },
    iconCircle: {
        width: 140, height: 140, borderRadius: 70,
        justifyContent: 'center', alignItems: 'center',
        elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20,
    },
    textWrapper: { alignItems: 'center', marginBottom: 30 },
    title: { fontSize: 48, fontWeight: '900', letterSpacing: -1 },
    subtitle: { fontSize: 18, fontWeight: '600', marginTop: 4 },
    featuresContainer: { flexDirection: 'row', justifyContent: 'center', width: '100%', paddingHorizontal: 20, marginTop: 20 },
    featureItem: { alignItems: 'center', width: width * 0.28, marginHorizontal: 5 },
    featureIconContainer: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    featureText: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
    bottomContent: { paddingHorizontal: 30, paddingBottom: 40 },
    description: { fontSize: 15, color: '#94A3B8', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
    buttonWrapper: { width: '100%' },
    mainButton: { width: '100%', height: 64, borderRadius: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
    gradientButton: { flex: 1, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: '800', marginRight: 10 },
    arrowIcon: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 4 },
    secondaryButton: { marginTop: 20, alignItems: 'center' },
    secondaryButtonText: { fontSize: 14, color: '#94A3B8' },
    signUpHighlight: { fontWeight: '800' },
});

export default WelcomeScreen;
