import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Clock, Pill } from 'lucide-react-native';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import api from '../services/api';
import { useTheme } from '../utils/ThemeContext';

const AddMedicationScreen = ({ navigation }) => {
    const { theme, isDarkMode } = useTheme();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        dosage: '',
        time: '09:00',
        frequency: 'Daily',
        instruction: ''
    });

    const frequencies = ['Daily', 'Weekly', 'Twice a day', 'As needed'];

    const handleAdd = async () => {
        if (!form.name || !form.dosage || !form.time) {
            Alert.alert('Missing Info', 'Please fill in the name, dosage, and time.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/medications', form);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Medication added successfully! 💊', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to add medication');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <LinearGradient
                colors={isDarkMode ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#F1F5F9']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.colors.surface }]}>
                        <ArrowLeft size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: theme.colors.text }]}>Add New Med</Text>
                    <View style={{ width: 44 }} />
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.inputSection}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>MEDICINE NAME</Text>
                            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
                                <Pill size={20} color={theme.colors.primary} />
                                <TextInput
                                    style={[styles.input, { color: theme.colors.text }]}
                                    placeholder="e.g. Paracetamol"
                                    placeholderTextColor="#94A3B8"
                                    value={form.name}
                                    onChangeText={(val) => setForm({ ...form, name: val })}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputSection, { flex: 1, marginRight: 10 }]}>
                                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>DOSAGE</Text>
                                <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
                                    <TextInput
                                        style={[styles.input, { color: theme.colors.text }]}
                                        placeholder="500mg"
                                        placeholderTextColor="#94A3B8"
                                        value={form.dosage}
                                        onChangeText={(val) => setForm({ ...form, dosage: val })}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputSection, { flex: 1 }]}>
                                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>TIME</Text>
                                <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
                                    <Clock size={20} color={theme.colors.primary} />
                                    <TextInput
                                        style={[styles.input, { color: theme.colors.text }]}
                                        placeholder="09:00"
                                        placeholderTextColor="#94A3B8"
                                        value={form.time}
                                        onChangeText={(val) => setForm({ ...form, time: val })}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputSection}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>FREQUENCY</Text>
                            <View style={styles.freqContainer}>
                                {frequencies.map((f) => (
                                    <TouchableOpacity
                                        key={f}
                                        onPress={() => setForm({ ...form, frequency: f })}
                                        style={[
                                            styles.freqBtn,
                                            { backgroundColor: theme.colors.surface },
                                            form.frequency === f && { backgroundColor: theme.colors.primary }
                                        ]}
                                    >
                                        <Text style={[
                                            styles.freqText,
                                            { color: theme.colors.text },
                                            form.frequency === f && { color: '#FFF' }
                                        ]}>{f}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputSection}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>INSTRUCTIONS (OPTIONAL)</Text>
                            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, height: 100, alignItems: 'flex-start', paddingTop: 12 }]}>
                                <TextInput
                                    style={[styles.input, { color: theme.colors.text, height: '100%' }]}
                                    placeholder="e.g. After breakfast"
                                    placeholderTextColor="#94A3B8"
                                    multiline
                                    value={form.instruction}
                                    onChangeText={(val) => setForm({ ...form, instruction: val })}
                                />
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <CustomButton
                                title="Add Medication"
                                onPress={handleAdd}
                                loading={loading}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5
    },
    title: { fontSize: 20, fontWeight: '800' },
    scrollContent: { padding: 20 },
    inputSection: { marginBottom: 25 },
    label: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 10, marginLeft: 5 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        borderRadius: 18,
        paddingHorizontal: 15,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600'
    },
    row: { flexDirection: 'row' },
    freqContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    freqBtn: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        elevation: 1
    },
    freqText: { fontSize: 13, fontWeight: '700' },
    footer: { marginTop: 20 }
});

export default AddMedicationScreen;
