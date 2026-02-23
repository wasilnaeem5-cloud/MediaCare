import { useFocusEffect } from '@react-navigation/native';
import { Calendar as CalendarIcon, Clock, User, X } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Calendar as CalendarPicker } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import Skeleton from '../components/Skeleton';
import api from '../services/api';
import { useTheme } from '../utils/ThemeContext';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const AppointmentsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const fetchAppointments = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      const endpoint = activeTab === 'Upcoming' ? '/appointments/upcoming' : '/appointments/history';
      const response = await api.get(endpoint);
      setAppointments(response.data || []);
    } catch (error) {
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [activeTab])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments(true);
  };

  const handleCancel = (id) => {
    Alert.alert('Cancel?', 'Delete this appointment?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            setActionLoading(true);
            await api.patch(`/appointments/${id}/cancel`);
            fetchAppointments();
          } catch (error) {
            Alert.alert('Error', 'Failed to cancel');
          } finally {
            setActionLoading(false);
          }
        }
      }
    ]);
  };

  const openReschedule = (apt) => {
    setSelectedApt(apt);
    setNewDate(apt.date);
    setNewTime(apt.time);
    setShowReschedule(true);
  };

  const handleReschedule = async () => {
    try {
      setActionLoading(true);
      await api.patch(`/appointments/${selectedApt._id}/reschedule`, { date: newDate, time: newTime });
      setShowReschedule(false);
      fetchAppointments();
    } catch (error) {
      Alert.alert('Error', 'Failed to reschedule');
    } finally {
      setActionLoading(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      Scheduled: { bg: 'rgba(99, 102, 241, 0.1)', text: '#6366F1' },
      Rescheduled: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' },
      Cancelled: { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444' },
      Completed: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
    };
    const style = colors[status] || colors.Scheduled;
    return (
      <View style={[styles.badge, { backgroundColor: style.bg }]}>
        <Text style={[styles.badgeText, { color: style.text }]}>{status}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatarBox, { backgroundColor: theme.colors.softBlue }]}>
          <User size={20} color={theme.colors.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.docName, { color: theme.colors.text }]}>{item.doctorName}</Text>
          <Text style={styles.docSpec}>{item.doctorSpec || 'Specialist'}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
      <View style={styles.cardFooter}>
        <View style={styles.infoRow}>
          <CalendarIcon size={14} color={theme.colors.primary} />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>{item.date}</Text>
          <Clock size={14} color={theme.colors.primary} style={{ marginLeft: 15 }} />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>{item.time}</Text>
        </View>
        {activeTab === 'Upcoming' && item.status !== 'Cancelled' && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => openReschedule(item)} style={styles.actionBtn}>
              <Text style={[styles.actionText, { color: theme.colors.primary }]}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCancel(item._id)} style={styles.actionBtn}>
              <Text style={[styles.actionText, { color: theme.colors.error }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Appointments" showProfile={false} />

        <View style={styles.tabBar}>
          {['Upcoming', 'Past'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && { backgroundColor: theme.colors.primary }]}
            >
              <Text style={[styles.tabLabel, { color: theme.colors.textSecondary }, activeTab === tab && { color: '#FFF' }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={{ padding: 20 }}>
            <Skeleton width="100%" height={150} style={{ marginBottom: 15 }} />
            <Skeleton width="100%" height={150} />
          </View>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <View style={[styles.emptyIconBox, { backgroundColor: theme.colors.surface }]}>
                  <CalendarIcon size={40} color={theme.colors.primary} />
                </View>
                <Text style={[styles.emptyText, { color: theme.colors.text }]}>No {activeTab.toLowerCase()} appointments</Text>
                <Text style={styles.emptySub}>Schedule a checkup with our world-class specialists.</Text>
                <TouchableOpacity
                  style={[styles.emptyBtn, { backgroundColor: theme.colors.primary }]}
                  onPress={() => navigation.navigate('ScheduleAppointment')}
                >
                  <Text style={styles.emptyBtnText}>Book Appointment</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}

        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('ScheduleAppointment')}
          activeOpacity={0.8}
        >
          <CalendarIcon size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Reschedule Modal (Polished) */}
        <Modal visible={showReschedule} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Reschedule</Text>
                <TouchableOpacity onPress={() => setShowReschedule(false)}><X size={24} color={theme.colors.text} /></TouchableOpacity>
              </View>
              <ScrollView>
                <CalendarPicker
                  onDayPress={d => setNewDate(d.dateString)}
                  markedDates={{ [newDate]: { selected: true, selectedColor: theme.colors.primary } }}
                  theme={{
                    calendarBackground: 'transparent',
                    dayTextColor: theme.colors.text,
                    monthTextColor: theme.colors.text,
                    arrowColor: theme.colors.primary,
                  }}
                />
                <View style={styles.timeGrid}>
                  {timeSlots.map(t => (
                    <TouchableOpacity key={t} onPress={() => setNewTime(t)} style={[styles.tSlot, newTime === t && { backgroundColor: theme.colors.primary }]}>
                      <Text style={[styles.tText, { color: theme.colors.text }, newTime === t && { color: '#FFF' }]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <CustomButton title="Save Changes" onPress={handleReschedule} loading={actionLoading} style={{ marginTop: 20 }} />
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
  tabBar: { flexDirection: 'row', padding: 20, paddingTop: 10 },
  tab: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12, marginRight: 10 },
  tabLabel: { fontSize: 14, fontWeight: '800' },
  card: { padding: 16, borderRadius: 24, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  docName: { fontSize: 16, fontWeight: '800' },
  docSpec: { fontSize: 13, color: '#94A3B8' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  divider: { height: 1, marginVertical: 15, opacity: 0.5 },
  cardFooter: { marginTop: 5 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 13, fontWeight: '700', marginLeft: 6 },
  actions: { flexDirection: 'row', marginTop: 15, justifyContent: 'flex-end' },
  actionBtn: { marginLeft: 20, padding: 5 },
  actionText: { fontSize: 13, fontWeight: '800' },
  empty: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyIconBox: { width: 80, height: 80, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  emptyText: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  emptySub: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  emptyBtn: { marginTop: 25, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  emptyBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  fab: { position: 'absolute', bottom: 95, right: 25, width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalBox: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
  tSlot: { width: '31%', paddingVertical: 10, borderRadius: 12, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  tText: { fontSize: 12, fontWeight: '700' }
});

export default AppointmentsScreen;
