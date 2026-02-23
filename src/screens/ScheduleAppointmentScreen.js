import { ArrowLeft, Star, User } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar as CalendarPicker } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import api from '../services/api';
import { useTheme } from '../utils/ThemeContext';

const doctors = [
    { id: '1', name: 'Dr. James Smith', specialty: 'Cardiologist', rating: '4.8', avatar: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png' },
    { id: '2', name: 'Dr. Sarah Wilson', specialty: 'Dermatologist', rating: '4.9', avatar: 'https://cdn-icons-png.flaticon.com/512/3304/3304567.png' },
    { id: '3', name: 'Dr. Robert Brown', specialty: 'General Physician', rating: '4.7', avatar: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png' },
];

const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const ScheduleAppointmentScreen = ({ navigation }) => {
    const { theme, isDarkMode } = useTheme();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBook = async () => {
        if (!selectedDate || !selectedDoctor || !selectedTime) {
            Alert.alert('Selection Required', 'Please choose your preferred doctor, date, and time.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/appointments/book', {
                doctorName: selectedDoctor.name,
                doctorSpec: selectedDoctor.specialty,
                date: selectedDate,
                time: selectedTime
            });

            if (response.data) {
                navigation.navigate('Confirmation', { appointment: response.data });
            }
        } catch (error) {
            Alert.alert('Booking Failed', error.response?.data?.message || 'This slot might be unavailable.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.colors.surface }]}>
                        <ArrowLeft size={22} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>New Appointment</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Choose Physician</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.doctorScroll}>
                            {doctors.map(doc => (
                                <TouchableOpacity
                                    key={doc.id}
                                    style={[
                                        styles.doctorCard,
                                        { backgroundColor: theme.colors.surface },
                                        selectedDoctor?.id === doc.id && { borderColor: theme.colors.primary, borderWidth: 2 }
                                    ]}
                                    onPress={() => setSelectedDoctor(doc)}
                                >
                                    <View style={[styles.avatarBox, { backgroundColor: theme.colors.softBlue }]}>
                                        <User size={24} color={theme.colors.primary} />
                                    </View>
                                    <Text style={[styles.docName, { color: theme.colors.text }]}>{doc.name}</Text>
                                    <Text style={styles.docSpec}>{doc.specialty}</Text>
                                    <View style={styles.ratingRow}>
                                        <Star size={12} color="#FACC15" fill="#FACC15" />
                                        <Text style={styles.ratingText}>{doc.rating}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Date</Text>
                        <View style={[styles.calendarBox, { backgroundColor: theme.colors.surface }]}>
                            <CalendarPicker
                                onDayPress={day => setSelectedDate(day.dateString)}
                                markedDates={{
                                    [selectedDate]: { selected: true, selectedColor: theme.colors.primary }
                                }}
                                minDate={new Date().toISOString().split('T')[0]}
                                theme={{
                                    calendarBackground: 'transparent',
                                    textSectionTitleColor: '#94A3B8',
                                    selectedDayBackgroundColor: theme.colors.primary,
                                    selectedDayTextColor: '#ffffff',
                                    todayTextColor: theme.colors.primary,
                                    dayTextColor: theme.colors.text,
                                    textDisabledColor: isDarkMode ? '#334155' : '#CBD5E1',
                                    monthTextColor: theme.colors.text,
                                    arrowColor: theme.colors.primary,
                                }}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Time</Text>
                        <View style={styles.timeGrid}>
                            {timeSlots.map(time => (
                                <TouchableOpacity
                                    key={time}
                                    style={[
                                        styles.timeSlot,
                                        { backgroundColor: theme.colors.surface },
                                        selectedTime === time && { backgroundColor: theme.colors.primary }
                                    ]}
                                    onPress={() => setSelectedTime(time)}
                                >
                                    <Text style={[
                                        styles.timeText,
                                        { color: theme.colors.text },
                                        selectedTime === time && { color: '#FFF' }
                                    ]}>{time}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
                    <CustomButton title="Confirm Appointment" onPress={handleBook} loading={loading} />
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    backBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '900', marginLeft: 15 },
    scroll: { paddingBottom: 150 },
    section: { marginTop: 25, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 15 },
    doctorScroll: { flexDirection: 'row' },
    doctorCard: { width: 150, padding: 16, borderRadius: 24, marginRight: 15, alignItems: 'center', elevation: 2 },
    avatarBox: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    docName: { fontSize: 15, fontWeight: '800', textAlign: 'center' },
    docSpec: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    ratingText: { fontSize: 12, fontWeight: '700', marginLeft: 4, color: '#94A3B8' },
    calendarBox: { borderRadius: 24, padding: 10, elevation: 2 },
    timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    timeSlot: { width: '31%', paddingVertical: 12, borderRadius: 14, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: 'transparent' },
    timeText: { fontSize: 13, fontWeight: '700' },
    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, borderTopWidth: 1 }
});

export default ScheduleAppointmentScreen;
