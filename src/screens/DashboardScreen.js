import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Activity,
    AlertCircle,
    Calendar,
    ChevronRight,
    FileText,
    HeartPulse,
    Info,
    Pill,
    PlusCircle
} from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import Header from '../components/Header';
import Skeleton from '../components/Skeleton';
import api from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';

const { width } = Dimensions.get('window');

const QuickAction = ({ title, icon: Icon, color, onPress, delay }) => {
    const { theme } = useTheme();
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

    return (
        <Animated.View style={[styles.quickActionContainer, animatedStyle]}>
            <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onPress();
                }}
                activeOpacity={0.7}
            >
                <LinearGradient
                    colors={[color, color + 'CC']}
                    style={styles.actionIconContainer}
                >
                    <Icon size={24} color="#FFF" />
                </LinearGradient>
                <Text style={[styles.actionTitle, { color: theme.colors.text }]}>{title}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const DashboardScreen = ({ navigation }) => {
    const { user } = useAuth();
    const { theme, isDarkMode } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        upcoming: null,
        healthScore: user?.healthScore || 75,
        insights: [],
        meds: [],
        vitals: user?.vitals || {}
    });

    const fetchAllData = async () => {
        try {
            // Fetch appointments and insights separately to avoid one failure blocking everything
            const fetchApts = api.get('/appointments/upcoming').catch(err => {
                console.warn('[Dashboard] Appointments failed:', err.message);
                return { data: [] };
            });

            const fetchInsights = api.get('/insights').catch(err => {
                console.warn('[Dashboard] Insights failed:', err.message);
                return { data: { healthScore: user?.healthScore || 75, insights: [] } };
            });

            const fetchMeds = api.get('/medications').catch(err => {
                console.warn('[Dashboard] Meds failed:', err.message);
                return { data: [] };
            });

            const [aptRes, insightRes, medRes] = await Promise.all([fetchApts, fetchInsights, fetchMeds]);

            setDashboardData({
                upcoming: aptRes.data[0] || null,
                healthScore: insightRes.data.healthScore || user?.healthScore || 75,
                insights: insightRes.data.insights || [],
                meds: medRes.data || [],
                vitals: user?.vitals || {}
            });
            console.log('[Dashboard] Data updated. Active Meds Count:', medRes.data?.length);
        } catch (error) {
            console.error('[Dashboard Component FATAL]', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAllData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchAllData();
    };

    const renderHealthScore = () => {
        const score = dashboardData.healthScore;
        const color = score > 80 ? theme.colors.success : score > 50 ? theme.colors.info : theme.colors.error;

        return (
            <Card style={[styles.scoreCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.scoreInfo}>
                    <Text style={styles.scoreLabel}>Overall Health Score</Text>
                    <Text style={[styles.scoreValue, { color }]}>{score}</Text>
                    <Text style={styles.scoreDesc}>Based on your activity this week</Text>
                </View>
                <View style={styles.scoreVisual}>
                    <HeartPulse size={48} color={color} />
                </View>
            </Card>
        );
    };

    const renderMeds = () => {
        const activeMeds = dashboardData.meds?.filter(m => m.isActive) || [];
        if (activeMeds.length === 0) return null;

        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Today's Meds</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Meds')}>
                        <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>View All</Text>
                    </TouchableOpacity>
                </View>
                {activeMeds.slice(0, 2).map((med) => (
                    <Card key={med._id} style={styles.medRow}>
                        <View style={[styles.medIconWrap, { backgroundColor: theme.colors.primary + '15' }]}>
                            <Pill size={20} color={theme.colors.primary} />
                        </View>
                        <View style={styles.medTextWrap}>
                            <Text style={[styles.medTitle, { color: theme.colors.text }]}>{med.name}</Text>
                            <Text style={styles.medSub}>{med.dosage} • {med.time}</Text>
                        </View>
                        <View style={styles.statusTag}>
                            <Text style={styles.statusText}>{med.frequency}</Text>
                        </View>
                    </Card>
                ))}
            </View>
        );
    };

    const renderInsights = () => (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Smart Insights</Text>
            {dashboardData.insights.length === 0 ? (
                <Text style={styles.noInsights}>All systems normal. You're on track! ✨</Text>
            ) : (
                dashboardData.insights.map((insight, idx) => (
                    <Card key={idx} style={[styles.insightRow, { borderLeftColor: insight.type === 'Alert' ? theme.colors.error : theme.colors.info }]}>
                        <View style={styles.insightIconWrap}>
                            {insight.type === 'Alert' ? <AlertCircle size={20} color={theme.colors.error} /> : <Info size={20} color={theme.colors.info} />}
                        </View>
                        <View style={styles.insightTextWrap}>
                            <Text style={[styles.insightTitle, { color: theme.colors.text }]}>{insight.title}</Text>
                            <Text style={styles.insightMsg}>{insight.message}</Text>
                        </View>
                    </Card>
                ))
            )}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SafeAreaView style={{ flex: 1 }}>
                <Header user={user} onProfilePress={() => navigation.navigate('Profile')} />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {/* Health Score Feature 2 */}
                    {loading ? <Skeleton width="90%" height={120} style={styles.skeleton} /> : renderHealthScore()}

                    {/* Quick Actions */}
                    <View style={styles.quickActionsContainer}>
                        <QuickAction title="Book" icon={PlusCircle} color={theme.colors.primary} delay={100} onPress={() => navigation.navigate('ScheduleAppointment')} />
                        <QuickAction title="Meds" icon={FileText} color={theme.colors.secondary} delay={200} onPress={() => navigation.navigate('Meds')} />
                        <QuickAction title="Records" icon={Activity} color={theme.colors.accent} delay={300} onPress={() => navigation.navigate('Records')} />
                        <QuickAction title="FAQ" icon={Info} color={theme.colors.info} delay={400} onPress={() => navigation.navigate('FAQ')} />
                    </View>

                    {/* Today's Medications */}
                    {loading ? <Skeleton width="100%" height={100} /> : renderMeds()}

                    {/* Upcoming Appointment */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Next Appointment</Text>
                        {loading ? <Skeleton width="100%" height={100} /> : (
                            dashboardData.upcoming ? (
                                <Card style={styles.aptCard}>
                                    <View style={styles.aptInfo}>
                                        <Text style={[styles.aptDoc, { color: theme.colors.text }]}>{dashboardData.upcoming.doctorName}</Text>
                                        <Text style={styles.aptSub}>{dashboardData.upcoming.doctorSpec}</Text>
                                        <View style={styles.dateTimeRow}>
                                            <Calendar size={14} color={theme.colors.primary} />
                                            <Text style={styles.dateTimeText}>{dashboardData.upcoming.date} at {dashboardData.upcoming.time}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={[styles.viewBtn, { backgroundColor: theme.colors.primary }]}>
                                        <ChevronRight size={20} color="#FFF" />
                                    </TouchableOpacity>
                                </Card>
                            ) : (
                                <TouchableOpacity style={styles.emptyApt} onPress={() => navigation.navigate('ScheduleAppointment')}>
                                    <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Schedule a checkup</Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>

                    {/* Feature 3: Smart Insights */}
                    {loading ? <Skeleton width="100%" height={150} /> : renderInsights()}

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>"Health is the greatest wealth." — Virgil</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 100 },
    skeleton: { alignSelf: 'center', borderRadius: 24, marginBottom: 20 },
    scoreCard: {
        flexDirection: 'row',
        padding: 24,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    scoreInfo: { flex: 1 },
    scoreLabel: { fontSize: 13, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 },
    scoreValue: { fontSize: 42, fontWeight: '900', marginVertical: 4 },
    scoreDesc: { fontSize: 12, color: '#94A3B8' },
    scoreVisual: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
    quickActionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    quickActionContainer: { width: '22%', alignItems: 'center' },
    actionIconContainer: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    actionTitle: { fontSize: 12, fontWeight: '700' },
    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 15 },
    aptCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24 },
    aptInfo: { flex: 1 },
    aptDoc: { fontSize: 18, fontWeight: '800' },
    aptSub: { fontSize: 14, color: '#64748B', marginBottom: 8 },
    dateTimeRow: { flexDirection: 'row', alignItems: 'center' },
    dateTimeText: { fontSize: 12, fontWeight: '600', marginLeft: 6, color: '#64748B' },
    viewBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    emptyApt: { padding: 30, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', borderColor: '#CBD5E1', alignItems: 'center' },
    insightRow: { flexDirection: 'row', padding: 16, borderRadius: 18, borderLeftWidth: 4, marginBottom: 12 },
    insightIconWrap: { marginRight: 12, marginTop: 2 },
    insightTextWrap: { flex: 1 },
    insightTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
    insightMsg: { fontSize: 13, color: '#64748B', lineHeight: 18 },
    noInsights: { color: '#94A3B8', textAlign: 'center', marginTop: 10 },
    footer: { alignItems: 'center', marginTop: 20 },
    footerText: { fontSize: 12, color: '#94A3B8', fontStyle: 'italic' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    medRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 10 },
    medIconWrap: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    medTextWrap: { flex: 1 },
    medTitle: { fontSize: 16, fontWeight: '800' },
    medSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
    statusTag: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { color: '#10B981', fontSize: 11, fontWeight: '700' },
});

export default DashboardScreen;
