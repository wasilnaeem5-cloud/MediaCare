import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Activity,
    Calendar,
    Clock,
    Droplets,
    FileText,
    HeartPulse,
    Moon,
    PlusCircle,
    Smartphone,
    User
} from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    RefreshControl,
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
import Card from '../components/Card';
import Header from '../components/Header';
import api from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('window');

const QuickAction = ({ title, icon: Icon, color, onPress, delay }) => {
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withDelay(delay, withSpring(1));
        opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value
    }));

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    return (
        <Animated.View style={[styles.quickActionContainer, animatedStyle]}>
            <TouchableOpacity
                style={styles.quickActionButton}
                onPress={handlePress}
                activeOpacity={0.7}
            >
                <LinearGradient
                    colors={[color, color + 'CC']}
                    style={styles.actionIconContainer}
                >
                    <Icon size={24} color={theme.colors.white} />
                </LinearGradient>
                <Text style={styles.actionTitle}>{title}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const HealthStat = ({ label, value, unit, icon: Icon, color, trend }) => {
    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
                withTiming(1, { duration: 1500 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }]
    }));

    return (
        <Card style={styles.insightCard}>
            <Animated.View style={[styles.insightIcon, { backgroundColor: color + '15' }, animatedStyle]}>
                <Icon size={20} color={color} />
            </Animated.View>
            <View style={styles.insightContent}>
                <View style={styles.insightValueRow}>
                    <Text style={styles.insightVal}>{value}</Text>
                    <Text style={styles.insightUnit}> {unit}</Text>
                </View>
                <View style={styles.insightLabelRow}>
                    <Text style={styles.insightLabel}>{label}</Text>
                    {trend && (
                        <Text style={[styles.trendText, { color: trend === 'up' ? theme.colors.error : theme.colors.success }]}>
                            {trend === 'up' ? '↑' : '↓'}
                        </Text>
                    )}
                </View>
            </View>
        </Card>
    );
};

const DashboardScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [upcomingAppointment, setUpcomingAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/appointments/upcoming');
            if (response.data && response.data.length > 0) {
                setUpcomingAppointment(response.data[0]);
            } else {
                setUpcomingAppointment(null);
            }
        } catch (error) {
            console.error('[Dashboard Error]', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDashboardData();
        }, [])
    );

    const onRefresh = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setRefreshing(true);
        fetchDashboardData();
    };

    const renderUpcomingCard = () => {
        if (loading && !refreshing) {
            return (
                <View style={styles.loadingPlaceholder}>
                    <ActivityIndicator color={theme.colors.primary} />
                </View>
            );
        }

        if (!upcomingAppointment) {
            return (
                <TouchableOpacity
                    style={styles.emptyAptContainer}
                    onPress={() => navigation.navigate('ScheduleAppointment')}
                >
                    <PlusCircle size={32} color={theme.colors.primary} />
                    <Text style={styles.emptyAptTitle}>No appointments scheduled</Text>
                    <Text style={styles.emptyAptSub}>Stay proactive with your health!</Text>
                </TouchableOpacity>
            );
        }

        return (
            <Card style={styles.premiumAptCard}>
                <View style={styles.aptTop}>
                    <View style={styles.docAvatarContainer}>
                        <View style={styles.docAvatar}>
                            <User size={24} color={theme.colors.primary} />
                        </View>
                        <View style={styles.onlineBadge} />
                    </View>
                    <View style={styles.aptDocInfo}>
                        <Text style={styles.premiumDocName}>{upcomingAppointment.doctorName}</Text>
                        <Text style={styles.premiumDocSpec}>Medical Specialist</Text>
                    </View>
                    <View style={styles.statusChip}>
                        <Text style={styles.statusText}>Upcoming</Text>
                    </View>
                </View>

                <View style={styles.aptDivider} />

                <View style={styles.aptBottom}>
                    <View style={styles.aptDateTime}>
                        <View style={styles.aptDateBox}>
                            <Calendar size={18} color={theme.colors.primary} />
                            <Text style={styles.aptDetailText}>{upcomingAppointment.date}</Text>
                        </View>
                        <View style={styles.aptDateBox}>
                            <Clock size={18} color={theme.colors.primary} />
                            <Text style={styles.aptDetailText}>{upcomingAppointment.time}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.viewDetailBtn}
                        onPress={() => navigation.navigate('Appointments')}
                    >
                        <Text style={styles.viewDetailText}>View Details</Text>
                    </TouchableOpacity>
                </View>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#EEF2FF', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    user={user}
                    onProfilePress={() => navigation.navigate('Profile')}
                />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.colors.primary}
                        />
                    }
                >
                    {/* Welcome Banner */}
                    <View style={styles.bannerSection}>
                        <LinearGradient
                            colors={[theme.colors.primary, theme.colors.accent]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.bannerBackground}
                        >
                            <View style={styles.bannerTextContainer}>
                                <Text style={styles.bannerTitle}>Daily Health Tip</Text>
                                <Text style={styles.bannerSubtitle}>
                                    Drinking 8 glasses of water today keeps your energy levels high! 💧
                                </Text>
                            </View>
                            <View style={styles.bannerIconWrapper}>
                                <HeartPulse size={60} color="rgba(255,255,255,0.2)" />
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.quickActionsContainer}>
                        <QuickAction
                            title="Book"
                            icon={PlusCircle}
                            color={theme.colors.primary}
                            delay={100}
                            onPress={() => navigation.navigate('ScheduleAppointment')}
                        />
                        <QuickAction
                            title="Records"
                            icon={FileText}
                            color={theme.colors.secondary}
                            delay={200}
                            onPress={() => navigation.navigate('Records')}
                        />
                        <QuickAction
                            title="Schedule"
                            icon={Calendar}
                            color={theme.colors.accent}
                            delay={300}
                            onPress={() => navigation.navigate('Appointments')}
                        />
                        <QuickAction
                            title="Profile"
                            icon={User}
                            color={theme.colors.info}
                            delay={400}
                            onPress={() => navigation.navigate('Profile')}
                        />
                    </View>

                    {/* Upcoming Appointment */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Your Appointment</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
                                <Text style={styles.seeAllText}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        {renderUpcomingCard()}
                    </View>

                    {/* Health Summary */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Today's Summary</Text>
                        <View style={styles.summaryGrid}>
                            <HealthStat
                                label="Heart Rate"
                                value="72"
                                unit="bpm"
                                icon={Activity}
                                color={theme.colors.error}
                                trend="up"
                            />
                            <HealthStat
                                label="Hydration"
                                value="1.2"
                                unit="L"
                                icon={Droplets}
                                color={theme.colors.info}
                            />
                            <HealthStat
                                label="Steps"
                                value="4,820"
                                unit=""
                                icon={Smartphone}
                                color={theme.colors.secondary}
                            />
                            <HealthStat
                                label="Sleep"
                                value="7.5"
                                unit="hrs"
                                icon={Moon}
                                color={theme.colors.accent}
                            />
                        </View>
                    </View>

                    {/* Encouraging Footer */}
                    <View style={styles.footerEncouragement}>
                        <Text style={styles.footerGreeting}>You're doing great today! ✨</Text>
                        <Text style={styles.footerSub}>Keep up the healthy habits.</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    bannerSection: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.sm,
    },
    bannerBackground: {
        height: 120,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        ...theme.shadows.medium,
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerTitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    bannerSubtitle: {
        color: theme.colors.white,
        fontSize: 18,
        fontWeight: '800',
        marginTop: 4,
        lineHeight: 24,
    },
    bannerIconWrapper: {
        marginLeft: 10,
    },
    quickActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        marginTop: 24,
    },
    quickActionContainer: {
        width: (width - 64) / 4,
        alignItems: 'center',
    },
    quickActionButton: {
        alignItems: 'center',
        width: '100%',
    },
    actionIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        ...theme.shadows.light,
    },
    actionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.text,
        textAlign: 'center',
    },
    section: {
        marginTop: 32,
        paddingHorizontal: theme.spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.colors.text,
    },
    seeAllText: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '700',
    },
    loadingPlaceholder: {
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyAptContainer: {
        height: 160,
        borderRadius: 24,
        backgroundColor: theme.colors.white,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyAptTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
        marginTop: 12,
    },
    emptyAptSub: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    premiumAptCard: {
        borderRadius: 24,
        padding: 20,
        backgroundColor: theme.colors.white,
        ...theme.shadows.medium,
    },
    aptTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    docAvatarContainer: {
        position: 'relative',
    },
    docAvatar: {
        width: 54,
        height: 54,
        borderRadius: 18,
        backgroundColor: theme.colors.softBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.white,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: theme.colors.success,
        borderWidth: 2,
        borderColor: theme.colors.white,
    },
    aptDocInfo: {
        flex: 1,
        marginLeft: 16,
    },
    premiumDocName: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.text,
    },
    premiumDocSpec: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    statusChip: {
        backgroundColor: 'rgba(94, 96, 206, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '800',
        color: theme.colors.primary,
    },
    aptDivider: {
        height: 1,
        backgroundColor: theme.colors.border,
        opacity: 0.5,
        marginVertical: 20,
    },
    aptBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    aptDateTime: {
        flex: 1,
    },
    aptDateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    aptDetailText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginLeft: 8,
    },
    viewDetailBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
    },
    viewDetailText: {
        color: theme.colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    insightCard: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
    },
    insightIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    insightContent: {
        marginLeft: 12,
        flex: 1,
    },
    insightValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    insightVal: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.text,
    },
    insightUnit: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    insightLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    insightLabel: {
        fontSize: 11,
        color: theme.colors.textSecondary,
        fontWeight: '700',
    },
    trendText: {
        fontSize: 12,
        fontWeight: '900',
        marginLeft: 4,
    },
    footerEncouragement: {
        alignItems: 'center',
        marginTop: 40,
        paddingBottom: 40,
    },
    footerGreeting: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.text,
    },
    footerSub: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: 4,
    }
});

export default DashboardScreen;
