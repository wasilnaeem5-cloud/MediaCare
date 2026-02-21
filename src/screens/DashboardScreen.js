import { useFocusEffect } from '@react-navigation/native';
import {
    Activity,
    Calendar,
    ChevronRight,
    Clock,
    FileText,
    HeartPulse,
    PlusCircle,
    TrendingUp,
    User
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import Header from '../components/Header';
import api from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { theme } from '../utils/theme';

const DashboardScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [upcomingAppointment, setUpcomingAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            console.log('[Dashboard] Fetching upcoming appointments...');
            const response = await api.get('/appointments/upcoming');

            // Assuming the API returns an array of appointments sorted by date
            if (response.data && response.data.length > 0) {
                setUpcomingAppointment(response.data[0]);
            } else {
                setUpcomingAppointment(null);
            }
        } catch (error) {
            console.error('[Dashboard Error] Failed to fetch data', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Refresh data whenever the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchDashboardData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    const QuickCard = ({ title, icon: Icon, color, onPress }) => (
        <TouchableOpacity
            style={styles.quickCardContainer}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.quickCardIcon, { backgroundColor: color }]}>
                <Icon size={24} color={theme.colors.white} />
            </View>
            <Text style={styles.quickCardTitle}>{title}</Text>
        </TouchableOpacity>
    );

    const renderUpcomingApt = () => {
        if (loading && !refreshing) {
            return (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator color={theme.colors.primary} />
                </View>
            );
        }

        if (!upcomingAppointment) {
            return (
                <Card style={styles.emptyAptCard}>
                    <Text style={styles.emptyAptText}>No upcoming appointments</Text>
                    <TouchableOpacity
                        style={styles.bookNowBtn}
                        onPress={() => navigation.navigate('ScheduleAppointment')}
                    >
                        <Text style={styles.bookNowText}>Book Now</Text>
                    </TouchableOpacity>
                </Card>
            );
        }

        const aptDate = new Date(upcomingAppointment.date);
        const dateString = aptDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });

        return (
            <Card style={styles.appointmentCard}>
                <View style={styles.aptHeader}>
                    <View style={styles.docInfo}>
                        <View style={styles.docAvatar}>
                            <Text style={styles.docInitial}>
                                {upcomingAppointment.doctorName.charAt(0)}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.docName}>{upcomingAppointment.doctorName}</Text>
                            <Text style={styles.docSpec}>Medical Specialist</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.aptDetailBtn}
                        onPress={() => navigation.navigate('Appointments')}
                    >
                        <ChevronRight size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.aptFooter}>
                    <View style={styles.aptMeta}>
                        <Calendar size={16} color={theme.colors.primary} />
                        <Text style={styles.aptMetaText}>{upcomingAppointment.date}</Text>
                    </View>
                    <View style={styles.aptMeta}>
                        <Clock size={16} color={theme.colors.primary} />
                        <Text style={styles.aptMetaText}>{upcomingAppointment.time}</Text>
                    </View>
                </View>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="MediCare" onProfilePress={() => navigation.navigate('Profile')} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.welcomeSection}>
                    <Text style={styles.greeting}>Hello, {user?.name || 'User'}! </Text>
                    <Text style={styles.subtitle}>How are you feeling today?</Text>
                </View>

                <View style={styles.quickActions}>
                    <QuickCard
                        title="Book Appt"
                        icon={PlusCircle}
                        color={theme.colors.primary}
                        onPress={() => navigation.navigate('ScheduleAppointment')}
                    />
                    <QuickCard
                        title="Records"
                        icon={FileText}
                        color={theme.colors.secondary}
                        onPress={() => navigation.navigate('Records')}
                    />
                    <QuickCard
                        title="Schedule"
                        icon={Calendar}
                        color={theme.colors.accent}
                        onPress={() => navigation.navigate('Appointments')}
                    />
                    <QuickCard
                        title="Profile"
                        icon={User}
                        color={theme.colors.info}
                        onPress={() => navigation.navigate('Profile')}
                    />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {renderUpcomingApt()}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Health Insights</Text>
                    <View style={styles.insightsRow}>
                        <Card style={styles.insightCard}>
                            <Activity size={24} color={theme.colors.error} />
                            <Text style={styles.insightVal}>72 bpm</Text>
                            <Text style={styles.insightLabel}>Heart Rate</Text>
                        </Card>
                        <Card style={styles.insightCard}>
                            <TrendingUp size={24} color={theme.colors.secondary} />
                            <Text style={styles.insightVal}>120/80</Text>
                            <Text style={styles.insightLabel}>Blood Pressure</Text>
                        </Card>
                    </View>
                </View>

                <Card style={styles.promoCard}>
                    <View style={styles.promoContent}>
                        <Text style={styles.promoTitle}>Stay Healthy!</Text>
                        <Text style={styles.promoText}>
                            Regular check-ups can help find problems before they start.
                        </Text>
                        <TouchableOpacity style={styles.promoBtn}>
                            <Text style={styles.promoBtnText}>Learn More</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.promoIcon}>
                        <HeartPulse size={40} color={theme.colors.white} />
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        paddingBottom: theme.spacing.xl,
    },
    welcomeSection: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '800',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.lg,
    },
    quickCardContainer: {
        alignItems: 'center',
        width: '22%',
    },
    quickCardIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
        ...theme.shadows.light,
    },
    quickCardTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text,
        textAlign: 'center',
    },
    section: {
        marginTop: theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text,
    },
    seeAll: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    appointmentCard: {
        padding: theme.spacing.md,
    },
    emptyAptCard: {
        padding: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    emptyAptText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        marginBottom: theme.spacing.md,
    },
    bookNowBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
    },
    bookNowText: {
        color: theme.colors.white,
        fontWeight: '700',
    },
    aptHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingBottom: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    docInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    docAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.softBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    docInitial: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    docName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
    },
    docSpec: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    aptFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    aptMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    aptMetaText: {
        fontSize: 14,
        color: theme.colors.text,
        marginLeft: theme.spacing.xs,
        fontWeight: '500',
    },
    loaderContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    insightsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing.sm,
    },
    insightCard: {
        width: '48%',
        alignItems: 'center',
        paddingVertical: theme.spacing.lg,
    },
    insightVal: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.colors.text,
        marginTop: theme.spacing.sm,
    },
    insightLabel: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    promoCard: {
        margin: theme.spacing.lg,
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.lg,
        position: 'relative',
        overflow: 'hidden',
    },
    promoContent: {
        flex: 1,
        zIndex: 1,
    },
    promoTitle: {
        color: theme.colors.white,
        fontSize: 22,
        fontWeight: '800',
    },
    promoText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginTop: theme.spacing.xs,
        marginBottom: theme.spacing.md,
    },
    promoBtn: {
        backgroundColor: theme.colors.white,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        alignSelf: 'flex-start',
    },
    promoBtnText: {
        color: theme.colors.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    promoIcon: {
        position: 'absolute',
        right: -10,
        bottom: -10,
        opacity: 0.2,
    }
});

export default DashboardScreen;
