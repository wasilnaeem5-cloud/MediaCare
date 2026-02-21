import { ArrowRight, Calendar, CheckCircle, Clock, User } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { theme } from '../utils/theme';

const AppointmentConfirmationScreen = ({ route, navigation }) => {
    const { appointment } = route.params || {};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.successIconContainer}>
                    <CheckCircle size={100} color={theme.colors.success} />
                </View>

                <Text style={styles.title}>Appointment Confirmed!</Text>
                <Text style={styles.subtitle}>Your appointment has been successfully booked.</Text>

                <View style={styles.detailsCard}>
                    <View style={styles.detailTitleRow}>
                        <Text style={styles.detailTitle}>Appointment Details</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <View style={styles.iconCircle}>
                            <User size={20} color={theme.colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.label}>Doctor</Text>
                            <Text style={styles.value}>{appointment?.doctorName || 'Dr. James Smith'}</Text>
                        </View>
                    </View>

                    <View style={styles.detailItem}>
                        <View style={styles.iconCircle}>
                            <Calendar size={20} color={theme.colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.label}>Date</Text>
                            <Text style={styles.value}>{appointment?.date || 'Today'}</Text>
                        </View>
                    </View>

                    <View style={styles.detailItem}>
                        <View style={styles.iconCircle}>
                            <Clock size={20} color={theme.colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.label}>Time</Text>
                            <Text style={styles.value}>{appointment?.time || '10:00 AM'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.tipContainer}>
                    <Text style={styles.tipText}>
                        Please arrive 10 minutes before your appointment time.
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <CustomButton
                    title="Back to Dashboard"
                    onPress={() => navigation.navigate('Main', { screen: 'Home' })}
                    style={styles.button}
                />
                <TouchableOpacity
                    style={styles.viewAptBtn}
                    onPress={() => navigation.navigate('Main', { screen: 'Appointments' })}
                >
                    <Text style={styles.viewAptText}>View All Appointments</Text>
                    <ArrowRight size={18} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        padding: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successIconContainer: {
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: theme.colors.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.xxl,
    },
    detailsCard: {
        backgroundColor: theme.colors.white,
        width: '100%',
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        ...theme.shadows.medium,
    },
    detailTitleRow: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingBottom: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.softBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    label: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
    },
    tipContainer: {
        marginTop: theme.spacing.xl,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.softPurple,
        borderRadius: theme.borderRadius.md,
        width: '100%',
    },
    tipText: {
        fontSize: 14,
        color: theme.colors.accent,
        textAlign: 'center',
        fontWeight: '600',
    },
    footer: {
        padding: theme.spacing.xl,
    },
    button: {
        height: 56,
    },
    viewAptBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.lg,
    },
    viewAptText: {
        fontSize: 16,
        color: theme.colors.primary,
        fontWeight: '700',
        marginRight: theme.spacing.xs,
    },
});

export default AppointmentConfirmationScreen;
