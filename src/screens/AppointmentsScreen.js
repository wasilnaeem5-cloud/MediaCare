import { useFocusEffect } from '@react-navigation/native';
import { Calendar as CalendarIcon, Clock, User, X } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
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
import api from '../services/api';
import { theme } from '../utils/theme';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const AppointmentsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Reschedule Modal State
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
      console.error('[Appointments Error]', error);
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
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              await api.patch(`/appointments/${id}/cancel`);
              Alert.alert('Success', 'Appointment cancelled successfully');
              fetchAppointments();
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to cancel');
            } finally {
              setActionLoading(false);
            }
          }
        }
      ]
    );
  };

  const openReschedule = (apt) => {
    setSelectedApt(apt);
    setNewDate(apt.date);
    setNewTime(apt.time);
    setShowReschedule(true);
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      Alert.alert('Error', 'Please select both date and time');
      return;
    }

    try {
      setActionLoading(true);
      await api.patch(`/appointments/${selectedApt._id}/reschedule`, {
        date: newDate,
        time: newTime
      });
      setShowReschedule(false);
      Alert.alert('Success', 'Appointment rescheduled successfully');
      fetchAppointments();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to reschedule');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Booked':
        return { bg: '#E0E7FF', text: '#4338CA' }; // Purple-ish
      case 'Rescheduled':
        return { bg: '#DBEAFE', text: '#1D4ED8' }; // Blue
      case 'Cancelled':
        return { bg: '#FEE2E2', text: '#B91C1C' }; // Red
      case 'Completed':
        return { bg: '#D1FAE5', text: '#047857' }; // Green
      default:
        return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const renderAppointmentItem = ({ item }) => {
    const { bg, text } = getStatusStyles(item.status);

    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.docInfo}>
            <View style={styles.avatar}>
              <User size={24} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={styles.docName}>{item.doctorName}</Text>
              <Text style={styles.specialty}>Medical Specialist</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: bg }]}>
            <Text style={[styles.statusText, { color: text }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <CalendarIcon size={18} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Clock size={18} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        </View>

        {activeTab === 'Upcoming' && item.status !== 'Cancelled' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.rescheduleBtn, actionLoading && { opacity: 0.5 }]}
              onPress={() => openReschedule(item)}
              disabled={actionLoading}
            >
              <Text style={styles.rescheduleText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelBtn, actionLoading && { opacity: 0.5 }]}
              onPress={() => handleCancel(item._id)}
              disabled={actionLoading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Appointments" showProfile={false} />

      <View style={styles.tabContainer}>
        {['Upcoming', 'Past'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'Past' ? 'History' : tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={item => item._id}
          renderItem={renderAppointmentItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <CalendarIcon size={64} color={theme.colors.border} />
              <Text style={styles.emptyText}>No {activeTab.toLowerCase()} appointments found</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ScheduleAppointment')}
      >
        <Text style={styles.fabText}>+ Book New</Text>
      </TouchableOpacity>

      {/* Reschedule Modal */}
      <Modal
        visible={showReschedule}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReschedule(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reschedule Appointment</Text>
              <TouchableOpacity onPress={() => setShowReschedule(false)}>
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSubtitle}>Select New Date</Text>
              <CalendarPicker
                onDayPress={day => setNewDate(day.dateString)}
                markedDates={{
                  [newDate]: { selected: true, selectedColor: theme.colors.primary }
                }}
                minDate={new Date().toISOString().split('T')[0]}
                theme={{
                  selectedDayBackgroundColor: theme.colors.primary,
                  todayTextColor: theme.colors.primary,
                  arrowColor: theme.colors.primary,
                }}
                style={styles.calendar}
              />

              <Text style={styles.modalSubtitle}>Select New Time</Text>
              <View style={styles.timeGrid}>
                {timeSlots.map(time => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      newTime === time && styles.selectedTimeSlot
                    ]}
                    onPress={() => setNewTime(time)}
                  >
                    <Text style={[
                      styles.timeText,
                      newTime === time && styles.selectedTimeText
                    ]}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <CustomButton
                title="Confirm Reschedule"
                onPress={handleReschedule}
                loading={actionLoading}
                style={styles.confirmBtn}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
  },
  tab: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.white,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  card: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  docInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.softBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  docName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  specialty: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  rescheduleBtn: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.softBlue,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  rescheduleText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.softRed,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  cancelText: {
    color: theme.colors.error,
    fontWeight: '700',
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    ...theme.shadows.medium,
    elevation: 8,
  },
  fabText: {
    color: theme.colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: theme.spacing.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  calendar: {
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '31%',
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedTimeSlot: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  selectedTimeText: {
    color: theme.colors.white,
  },
  confirmBtn: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  }
});

export default AppointmentsScreen;
