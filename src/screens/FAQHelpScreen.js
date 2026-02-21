import { ArrowLeft, ChevronDown, ChevronUp, Mail, MessageSquare, Phone } from 'lucide-react-native';
import { useState } from 'react';
import { LayoutAnimation, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { theme } from '../utils/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQItem = ({ question, answer }) => {
    const [expanded, setExpanded] = useState(false);

    const toggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <TouchableOpacity style={styles.faqCard} onPress={toggle} activeOpacity={0.7}>
            <View style={styles.faqHeader}>
                <Text style={styles.question}>{question}</Text>
                {expanded ? <ChevronUp size={20} color={theme.colors.primary} /> : <ChevronDown size={20} color={theme.colors.textSecondary} />}
            </View>
            {expanded && <Text style={styles.answer}>{answer}</Text>}
        </TouchableOpacity>
    );
};

const FAQHelpScreen = ({ navigation }) => {
    const faqs = [
        {
            question: 'How do I book an appointment?',
            answer: "You can book an appointment by clicking the 'Book Appointment' button on the dashboard or the '+' button in the appointments tab. Select your doctor, date, and preferred time slot."
        },
        {
            question: 'Can I cancel or reschedule my appointment?',
            answer: "Yes, you can manage your appointments in the 'Appointments' tab. Note that cancellations should ideally be made 24 hours in advance."
        },
        {
            question: 'Where can I find my medical records?',
            answer: "All your uploaded reports and medical history are stored securely in the 'Records' tab for easy access anytime."
        },
        {
            question: 'Is my health data secure?',
            answer: "Absolutely. We use industry-standard encryption to ensure your personal health information remains private and secure."
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & FAQ</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Support</Text>
                    <View style={styles.contactContainer}>
                        <TouchableOpacity style={styles.contactMethod}>
                            <View style={[styles.contactIcon, { backgroundColor: theme.colors.softBlue }]}>
                                <MessageSquare size={24} color={theme.colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.contactTitle}>Live Chat</Text>
                                <Text style={styles.contactSub}>Available 24/7</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.contactMethod}>
                            <View style={[styles.contactIcon, { backgroundColor: theme.colors.softGreen }]}>
                                <Phone size={24} color={theme.colors.secondary} />
                            </View>
                            <View>
                                <Text style={styles.contactTitle}>Call Us</Text>
                                <Text style={styles.contactSub}>+1 800-MEDICARE</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.contactMethod}>
                            <View style={[styles.contactIcon, { backgroundColor: theme.colors.softPurple }]}>
                                <Mail size={24} color={theme.colors.accent} />
                            </View>
                            <View>
                                <Text style={styles.contactTitle}>Email Support</Text>
                                <Text style={styles.contactSub}>support@medicare.com</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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
        paddingBottom: theme.spacing.xxl,
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
    faqCard: {
        backgroundColor: theme.colors.white,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
        ...theme.shadows.light,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.text,
        flex: 1,
        marginRight: theme.spacing.md,
    },
    answer: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.md,
        lineHeight: 20,
    },
    contactContainer: {
        gap: theme.spacing.sm,
    },
    contactMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.light,
    },
    contactIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
    },
    contactSub: {
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
});

export default FAQHelpScreen;
