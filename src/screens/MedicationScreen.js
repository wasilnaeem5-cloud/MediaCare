import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Bell,
    CheckCircle2,
    Clock,
    Plus,
    Trash2
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Skeleton from '../components/Skeleton';
import api from '../services/api';
import { useTheme } from '../utils/ThemeContext';

const { width } = Dimensions.get('window');

const MedicationScreen = ({ navigation }) => {
    const { theme, isDarkMode } = useTheme();
    const [meds, setMeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loggingId, setLoggingId] = useState(null);

    const fetchMeds = async () => {
        try {
            const response = await api.get('/medications');
            setMeds(response.data);
        } catch (error) {
            console.error('[Meds Error]', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMeds();
        }, [])
    );

    const handleLogTaken = async (id) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setLoggingId(id);
        try {
            await api.patch(`/medications/${id}/log`);
            fetchMeds();
            Alert.alert('Done!', "Medication logged for today. You're doing great! 🌟");
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to log');
        } finally {
            setLoggingId(null);
        }
    };

    const handleDelete = (id) => {
        Alert.alert('Remove?', 'Stop tracking this medication?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.delete(`/medications/${id}`);
                        fetchMeds();
                    } catch (e) {
                        Alert.alert('Error', 'Failed to remove');
                    }
                }
            }
        ]);
    };

    const renderSkeletons = () => (
        <View style={{ padding: 20 }}>
            {[1, 2, 3].map(i => (
                <Skeleton key={i} width="100%" height={100} style={{ marginBottom: 16, borderRadius: 20 }} />
            ))}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <LinearGradient
                colors={isDarkMode ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#F1F5F9']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title, { color: theme.colors.text }]}>Medications</Text>
                        <Text style={styles.subtitle}>Daily Reminders & Trackers</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AddMedication')}
                        style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
                    >
                        <Plus color="#FFF" size={24} />
                    </TouchableOpacity>
                </View>

                {loading ? renderSkeletons() : (
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {meds.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Bell size={64} color={theme.colors.border} />
                                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                                    No medications tracked yet.
                                </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('AddMedication')}
                                    style={styles.emptyAddBtn}
                                >
                                    <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Add Medicine</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            meds.map((med) => (
                                <View key={med._id} style={[styles.medCard, { backgroundColor: theme.colors.surface }]}>
                                    <View style={styles.medIconBox}>
                                        <Clock size={24} color={theme.colors.primary} />
                                    </View>

                                    <View style={styles.medInfo}>
                                        <Text style={[styles.medName, { color: theme.colors.text }]}>{med.name}</Text>
                                        <Text style={styles.medDosage}>{med.dosage} • {med.time}</Text>
                                        <View style={styles.frequencyTag}>
                                            <Text style={styles.frequencyText}>{med.frequency}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.actions}>
                                        <TouchableOpacity
                                            onPress={() => handleLogTaken(med._id)}
                                            disabled={loggingId === med._id}
                                            style={styles.checkBtn}
                                        >
                                            {loggingId === med._id ? (
                                                <ActivityIndicator size="small" color={theme.colors.primary} />
                                            ) : (
                                                <CheckCircle2 size={28} color={theme.colors.success} />
                                            )}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDelete(med._id)}
                                            style={styles.deleteBtn}
                                        >
                                            <Trash2 size={20} color={theme.colors.error} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        marginTop: 2,
    },
    addBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    scrollContent: {
        padding: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: '500',
    },
    emptyAddBtn: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: 'rgba(94, 96, 206, 0.1)',
    },
    medCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 15,
    },
    medIconBox: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: 'rgba(94, 96, 206, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    medInfo: {
        flex: 1,
        marginLeft: 16,
    },
    medName: {
        fontSize: 18,
        fontWeight: '800',
    },
    medDosage: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 2,
    },
    frequencyTag: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 8,
    },
    frequencyText: {
        color: '#10B981',
        fontSize: 11,
        fontWeight: '700',
    },
    actions: {
        alignItems: 'center',
    },
    checkBtn: {
        padding: 10,
    },
    deleteBtn: {
        marginTop: 10,
        opacity: 0.6,
    }
});

export default MedicationScreen;
