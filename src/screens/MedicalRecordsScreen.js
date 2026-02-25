import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import {
    Activity,
    Beaker,
    FileText,
    Pill,
    Plus,
    Search,
    Trash2,
    X
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import Skeleton from '../components/Skeleton';
import api, { recordService } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';

const MedicalRecordsScreen = () => {
    const { user } = useAuth();
    const { theme, isDarkMode } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [newRecord, setNewRecord] = useState({
        title: '',
        type: 'Blood Test',
        value: '',
        unit: '',
        doctorName: '',
        notes: ''
    });

    const recordTypes = ['Blood Test', 'Radiology', 'Clinical', 'Pharmacy', 'Other'];

    const typeIcons = {
        'Blood Test': Beaker,
        'Radiology': Activity,
        'Clinical': FileText,
        'Pharmacy': Pill,
        'Other': FileText
    };

    const fetchRecords = async (isRefreshing = false) => {
        try {
            if (!isRefreshing) setLoading(true);
            const response = await recordService.getAll();
            setRecords(response.data || []);
        } catch (error) {
            console.error('[Records Error]', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRecords();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchRecords(true);
    };

    const handleAddRecord = async () => {
        if (!newRecord.title || !newRecord.type) {
            Alert.alert('Error', 'Please provide a title and type');
            return;
        }

        setActionLoading(true);
        try {
            await recordService.add(newRecord);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setShowAddModal(false);
            setNewRecord({
                title: '',
                type: 'Blood Test',
                value: '',
                unit: '',
                doctorName: '',
                notes: ''
            });
            fetchRecords();
        } catch (error) {
            Alert.alert('Error', 'Failed to add record');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteRecord = (id) => {
        Alert.alert('Delete Record', 'Are you sure you want to remove this record?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.delete(`/records/${id}`);
                        fetchRecords();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete record');
                    }
                }
            }
        ]);
    };


    const filteredRecords = records.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderRecordItem = ({ item }) => {
        const Icon = typeIcons[item.type] || FileText;
        const color = item.type === 'Blood Test' ? theme.colors.primary :
            item.type === 'Radiology' ? theme.colors.secondary :
                item.type === 'Pharmacy' ? theme.colors.accent : theme.colors.info;

        return (
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.recordContent}>
                    <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                        <Icon size={24} color={color} />
                    </View>
                    <View style={styles.recordInfo}>
                        <Text style={[styles.recordTitle, { color: theme.colors.text }]}>{item.title}</Text>
                        <View style={styles.recordMeta}>
                            <Text style={styles.recordType}>{item.type}</Text>
                            <Text style={styles.dot}> • </Text>
                            <Text style={styles.recordDate}>{new Date(item.date).toLocaleDateString()}</Text>
                        </View>
                        {item.value && (
                            <Text style={[styles.recordValue, { color: theme.colors.primary }]}>
                                {item.value} {item.unit}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteRecord(item._id)} style={styles.deleteBtn}>
                        <Trash2 size={18} color={theme.colors.error} opacity={0.6} />
                    </TouchableOpacity>
                </View>
            </Card>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SafeAreaView style={{ flex: 1 }}>
                <Header title="Health Records" showProfile={false} />

                <View style={styles.searchContainer}>
                    <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
                        <Search size={20} color={theme.colors.textSecondary} />
                        <TextInput
                            style={[styles.searchInput, { color: theme.colors.text }]}
                            placeholder="Search records..."
                            placeholderTextColor="#94A3B8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {loading ? (
                    <View style={{ padding: 20 }}>
                        <Skeleton width="100%" height={100} style={{ marginBottom: 15 }} />
                        <Skeleton width="100%" height={100} style={{ marginBottom: 15 }} />
                        <Skeleton width="100%" height={100} />
                    </View>
                ) : (
                    <FlatList
                        data={filteredRecords}
                        keyExtractor={item => item._id}
                        renderItem={renderRecordItem}
                        contentContainerStyle={styles.listContent}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        ListEmptyComponent={
                            <View style={styles.empty}>
                                <FileText size={60} color={theme.colors.border} />
                                <Text style={styles.emptyText}>No records found</Text>
                                <Text style={styles.emptySub}>Add your blood test results or clinical reports to track your health history.</Text>
                            </View>
                        }
                    />
                )}

                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                    onPress={() => setShowAddModal(true)}
                >
                    <Plus size={24} color="#FFF" />
                    <Text style={styles.fabText}>Add Record</Text>
                </TouchableOpacity>

                {/* Add Record Modal */}
                <Modal visible={showAddModal} animationType="slide" transparent>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalBox, { backgroundColor: theme.colors.surface }]}>
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>New Health Record</Text>
                                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                    <X size={24} color={theme.colors.text} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.inputGroup}>
                                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>TITLE</Text>
                                    <View style={[styles.inputBox, { backgroundColor: theme.colors.background }]}>
                                        <TextInput
                                            style={[styles.input, { color: theme.colors.text }]}
                                            placeholder="e.g. Annual Blood Test"
                                            placeholderTextColor="#64748B"
                                            value={newRecord.title}
                                            onChangeText={v => setNewRecord({ ...newRecord, title: v })}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>TYPE</Text>
                                    <View style={styles.typeGrid}>
                                        {recordTypes.map(t => (
                                            <TouchableOpacity
                                                key={t}
                                                onPress={() => setNewRecord({ ...newRecord, type: t })}
                                                style={[
                                                    styles.typeBtn,
                                                    { backgroundColor: theme.colors.background },
                                                    newRecord.type === t && { backgroundColor: theme.colors.primary }
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.typeText,
                                                    { color: theme.colors.text },
                                                    newRecord.type === t && { color: '#FFF' }
                                                ]}>{t}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>VALUE</Text>
                                        <View style={[styles.inputBox, { backgroundColor: theme.colors.background }]}>
                                            <TextInput
                                                style={[styles.input, { color: theme.colors.text }]}
                                                placeholder="e.g. 5.6"
                                                placeholderTextColor="#64748B"
                                                value={newRecord.value}
                                                onChangeText={v => setNewRecord({ ...newRecord, value: v })}
                                            />
                                        </View>
                                    </View>
                                    <View style={[styles.inputGroup, { flex: 0.5 }]}>
                                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>UNIT</Text>
                                        <View style={[styles.inputBox, { backgroundColor: theme.colors.background }]}>
                                            <TextInput
                                                style={[styles.input, { color: theme.colors.text }]}
                                                placeholder="mg/dL"
                                                placeholderTextColor="#64748B"
                                                value={newRecord.unit}
                                                onChangeText={v => setNewRecord({ ...newRecord, unit: v })}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>DOCTOR NAME</Text>
                                    <View style={[styles.inputBox, { backgroundColor: theme.colors.background }]}>
                                        <TextInput
                                            style={[styles.input, { color: theme.colors.text }]}
                                            placeholder="Dr. Sarah Johnson"
                                            placeholderTextColor="#64748B"
                                            value={newRecord.doctorName}
                                            onChangeText={v => setNewRecord({ ...newRecord, doctorName: v })}
                                        />
                                    </View>
                                </View>

                                <CustomButton
                                    title="Add Record"
                                    onPress={handleAddRecord}
                                    loading={actionLoading}
                                    style={{ marginTop: 20 }}
                                />
                                <View style={{ height: 40 }} />
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    searchContainer: { padding: 20, paddingTop: 10 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 54,
        borderRadius: 18,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10
    },
    searchInput: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600' },
    listContent: { padding: 20, paddingBottom: 100 },
    card: { padding: 20, borderRadius: 24, marginBottom: 16 },
    recordContent: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    recordInfo: { flex: 1 },
    recordTitle: { fontSize: 17, fontWeight: '800' },
    recordMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    recordType: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
    dot: { color: '#94A3B8' },
    recordDate: { fontSize: 13, color: '#94A3B8' },
    recordValue: { fontSize: 15, fontWeight: '800', marginTop: 8 },
    deleteBtn: { padding: 5 },
    empty: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
    emptyText: { fontSize: 18, fontWeight: '800', marginTop: 20 },
    emptySub: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginTop: 10, lineHeight: 22 },
    fab: {
        position: 'absolute',
        bottom: 95,
        right: 25,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 22,
        paddingVertical: 15,
        borderRadius: 22,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 15
    },
    fabText: { color: '#FFF', fontWeight: '900', marginLeft: 10, fontSize: 15 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalBox: { borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 30, maxHeight: '90%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    modalTitle: { fontSize: 22, fontWeight: '900' },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 10, marginLeft: 5 },
    inputBox: { height: 56, borderRadius: 16, paddingHorizontal: 15, justifyContent: 'center' },
    input: { fontSize: 15, fontWeight: '600' },
    typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    typeBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
    typeText: { fontSize: 13, fontWeight: '700' },
    row: { flexDirection: 'row' }
});

export default MedicalRecordsScreen;
