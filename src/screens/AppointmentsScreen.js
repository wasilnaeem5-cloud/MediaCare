import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../utils/theme';
import Header from '../components/Header';
import Card from '../components/Card';
import { Calendar, Clock, MapPin, ChevronRight, User } from 'lucide-react-native';

const AppointmentsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const appointments = [
    {
      id: '1',
      doctor: 'Dr. James Smith',
      specialty: 'Cardiologist',
      date: 'Oct 24, 2024',
      time: '10:30 AM',
      type: 'Upcoming',
      status: 'Confirmed'
    },
    {
      id: '2',
      doctor: 'Dr. Sarah Wilson',
      specialty: 'Dermatologist',
      date: 'Nov 02, 2024',
      time: '02:00 PM',
      type: 'Upcoming',
      status: 'Pending'
    },
    {
      id: '3',
      doctor: 'Dr. Robert Brown',
      specialty: 'General Physician',
      date: 'Sep 15, 2024',
      time: '11:00 AM',
      type: 'Past',
      status: 'Completed'
    },
    {
      id: '4',
      doctor: 'Dr. Emily Davis',
      specialty: 'Pediatrician',
      date: 'Aug 20, 2024',
      time: '09:30 AM',
      type: 'Past',
      status: 'Completed'
    }
  ];

  const filteredAppointments = appointments.filter(apt => apt.type === activeTab);

  const renderAppointmentItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.docInfo}>
          <View style={styles.avatar}>
            <User size={24} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.docName}>{item.doctor}</Text>
            <Text style={styles.specialty}>{item.specialty}</Text>
          </View>
        </View>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: item.status === 'Confirmed' ? theme.colors.softGreen : 
                          item.status === 'Pending' ? theme.colors.softPurple : 
                          theme.colors.softBlue }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === 'Confirmed' ? theme.colors.success : 
                     item.status === 'Pending' ? theme.colors.accent : 
                     theme.colors.primary }
          ]}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Calendar size={18} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={18} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
      </View>

      {item.type === 'Upcoming' && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.rescheduleBtn}>
            <Text style={styles.rescheduleText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );

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
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredAppointments}
        keyExtractor={item => item.id}
        renderItem={renderAppointmentItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Calendar size={64} color={theme.colors.border} />
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} appointments found</Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('ScheduleAppointment')}
      >
        <Text style={styles.fabText}>+ Book New</Text>
      </TouchableOpacity>
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
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  fabText: {
    color: theme.colors.white,
    fontWeight: '800',
    fontSize: 16,
  }
});

export default AppointmentsScreen;
