import { ArrowLeft, User } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar as CalendarPicker } from 'react-native-calendars';
import CustomButton from '../components/CustomButton';
import { theme } from '../utils/theme';

const doctors = [
    { id: '1', name: 'Dr. James Smith', specialty: 'Cardiologist', rating: '4.8' },
    { id: '2', name: 'Dr. Sarah Wilson', specialty: 'Dermatologist', rating: '4.9' },
    { id: '3', name: 'Dr. Robert Brown', specialty: 'General Physician', rating: '4.7' },
];

const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const ScheduleAppointmentScreen = ({ navigation }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBook = () => {
        if (!selectedDate || !selectedDoctor || !selectedTime) {
            Alert.alert('Error', 'Please select a date, doctor, and time slot.');
            return;
        }

        setLoading(true);
        // Mock API call
        setTimeout(() => {
            setLoading(false);
            navigation.navigate('Confirmation', {
                appointment: {
                    doctor: selectedDoctor,
                    date: selectedDate,
                    time: selectedTime
                }
            });
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Schedule Appointment</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Doctor</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.doctorList}>
                        {doctors.map(doc => (
                            <TouchableOpacity
                                key={doc.id}
                                style={[
                                    styles.doctorCard,
                                    selectedDoctor?.id === doc.id && styles.selectedCard
                                ]}
                                onPress={() => setSelectedDoctor(doc)}
                            >
                                <View style={styles.docAvatar}>
                                    <User size={24} color={selectedDoctor?.id === doc.id ? theme.colors.white : theme.colors.primary} />
                                </View>
                                <Text style={[styles.docName, selectedDoctor?.id === doc.id && styles.selectedText]}>{doc.name}</Text>
                                <Text style={[styles.docSpec, selectedDoctor?.id === doc.id && styles.selectedSubText]}>{doc.specialty}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Date</Text>
                    <View style={styles.calendarContainer}>
                        <CalendarPicker
                            onDayPress={day => setSelectedDate(day.dateString)}
                            markedDates={{
                                [selectedDate]: { selected: true, selectedColor: theme.colors.primary }
                            }}
                            theme={{
                                selectedDayBackgroundColor: theme.colors.primary,
                                todayTextColor: theme.colors.primary,
                                arrowColor: theme.colors.primary,
                            }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Available Time Slots</Text>
                    <View style={styles.timeGrid}>
                        {timeSlots.map(time => (
                            <TouchableOpacity
                                key={time}
                                style={[
                                    styles.timeSlot,
                                    selectedTime === time && styles.selectedTimeSlot
                                ]}
                                onPress={() => setSelectedTime(time)}
                            >
                                <Text style={[
                                    styles.timeText,
                                    selectedTime === time && styles.selectedTimeText
                                ]}>{time}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    title="Confirm Appointment"
                    onPress={handleBook}
                    loading={loading}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    backBtn: {
        marginRight: theme.spacing.md,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.colors.text,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    section: {
        marginTop: theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    doctorList: {
        flexDirection: 'row',
    },
    doctorCard: {
        backgroundColor: theme.colors.white,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        marginRight: theme.spacing.md,
        width: 140,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
        ...theme.shadows.light,
    },
    selectedCard: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    docAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.softBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    docName: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.text,
        textAlign: 'center',
    },
    docSpec: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: 2,
    },
    selectedText: {
        color: theme.colors.white,
    },
    selectedSubText: {
        color: 'rgba(255,255,255,0.8)',
    },
    calendarContainer: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.light,
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    timeSlot: {
        width: '30%',
        backgroundColor: theme.colors.white,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        alignItems: 'center',
        marginBottom: theme.spacing.md,
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
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    }
});

export default ScheduleAppointmentScreen;
