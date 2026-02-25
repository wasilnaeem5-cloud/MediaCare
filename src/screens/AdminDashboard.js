import {
    Activity,
    Calendar,
    ChevronRight,
    LogOut,
    ShieldAlert,
    TrendingUp,
    Users
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import { adminService } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const { theme, isDarkMode } = useTheme();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const response = await adminService.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('[Admin Error]', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
                <Icon size={24} color={color} />
            </View>
            <View style={styles.statInfo}>
                <Text style={styles.statLabel}>{title}</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
            </View>
        </Card>
    );

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title, { color: theme.colors.text }]}>Admin Panel</Text>
                        <Text style={styles.subtitle}>System Overview & Stats</Text>
                    </View>
                    <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                        <LogOut size={20} color={theme.colors.error} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.grid}>
                        <StatCard
                            title="Total Users"
                            value={stats?.users || 0}
                            icon={Users}
                            color={theme.colors.primary}
                        />
                        <StatCard
                            title="Appointments"
                            value={stats?.appointments || 0}
                            icon={Calendar}
                            color={theme.colors.secondary}
                        />
                        <StatCard
                            title="Active Meds"
                            value={stats?.medications || 0}
                            icon={Activity}
                            color={theme.colors.success}
                        />
                        <StatCard
                            title="Completion Rate"
                            value={`${Math.round(stats?.completionRate || 0)}%`}
                            icon={TrendingUp}
                            color={theme.colors.info}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Controls</Text>
                        <TouchableOpacity style={[styles.controlItem, { backgroundColor: theme.colors.surface }]}>
                            <ShieldAlert size={24} color={theme.colors.error} />
                            <Text style={[styles.controlText, { color: theme.colors.text }]}>Flagged Reports</Text>
                            <ChevronRight size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.controlItem, { backgroundColor: theme.colors.surface }]}>
                            <Users size={24} color={theme.colors.primary} />
                            <Text style={[styles.controlText, { color: theme.colors.text }]}>Manage All Users</Text>
                            <ChevronRight size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    title: { fontSize: 28, fontWeight: '900' },
    subtitle: { fontSize: 14, color: '#64748B' },
    logoutBtn: { padding: 10, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)' },
    scroll: { padding: 20 },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    statCard: {
        width: '48%',
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        alignItems: 'center',
    },
    statIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statInfo: { alignItems: 'center' },
    statLabel: { fontSize: 12, color: '#64748B', fontWeight: '700' },
    statValue: { fontSize: 22, fontWeight: '900', marginTop: 4 },
    section: { marginTop: 24 },
    sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 16 },
    controlItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 18,
        marginBottom: 12,
    },
    controlText: { flex: 1, marginLeft: 16, fontWeight: '700', fontSize: 16 },
});

export default AdminDashboard;
