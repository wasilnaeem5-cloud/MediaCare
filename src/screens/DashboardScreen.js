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
import { useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import Header from '../components/Header';
import { storage } from '../utils/storage';
import { theme } from '../utils/theme';

const DashboardScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const userData = await storage.getUser();
        setUser(userData);
    };

    const onRefresh = () => {
        setRefreshing(true);
        // Reload data logic...
        setTimeout(() => setRefreshing(false), 1500);
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

    return (
        <SafeAreaView style={styles.container}>
            <Header title="MediCare" onProfilePress={() => navigation.navigate('Profile')} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.welcomeSection}>
                    <Text style={styles.greeting}>Hello, {user?.name || 'User'}! 👋</Text>
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

                    <Card style={styles.appointmentCard}>
                        <View style={styles.aptHeader}>
                            <View style={styles.docInfo}>
                                <View style={styles.docAvatar}>
                                    <Text style={styles.docInitial}>JS</Text>
                                </View>
                                <View>
                                    <Text style={styles.docName}>Dr. James Smith</Text>
                                    <Text style={styles.docSpec}>Cardiologist</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.aptDetailBtn}>
                                <ChevronRight size={20} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.aptFooter}>
                            <View style={styles.aptMeta}>
                                <Calendar size={16} color={theme.colors.primary} />
                                <Text style={styles.aptMetaText}>Monday, Oct 24</Text>
                            </View>
                            <View style={styles.aptMeta}>
                                <Clock size={16} color={theme.colors.primary} />
                                <Text style={styles.aptMetaText}>10:30 AM</Text>
                            </View>
                        </View>
                    </Card>
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
