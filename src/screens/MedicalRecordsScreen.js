import { Activity, Beaker, Download, FileText, Pill, Plus, Search } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import Header from '../components/Header';
import { theme } from '../utils/theme';

const MedicalRecordsScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const records = [
        {
            id: '1',
            title: 'Blood Test Results',
            date: 'Oct 15, 2024',
            type: 'Laboratory',
            icon: Beaker,
            color: theme.colors.primary,
        },
        {
            id: '2',
            title: 'X-Ray Report',
            date: 'Sep 28, 2024',
            type: 'Radiology',
            icon: Activity,
            color: theme.colors.secondary,
        },
        {
            id: '3',
            title: 'Prescription - Allergies',
            date: 'Aug 10, 2024',
            type: 'Pharmacy',
            icon: Pill,
            color: theme.colors.accent,
        },
        {
            id: '4',
            title: 'General Checkup',
            date: 'Jun 12, 2024',
            type: 'Clinical',
            icon: FileText,
            color: theme.colors.info,
        }
    ];

    const renderRecordItem = ({ item }) => (
        <Card style={styles.card}>
            <View style={styles.recordContent}>
                <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                    <item.icon size={26} color={item.color} />
                </View>
                <View style={styles.recordInfo}>
                    <Text style={styles.recordTitle}>{item.title}</Text>
                    <View style={styles.recordMeta}>
                        <Text style={styles.recordType}>{item.type}</Text>
                        <Text style={styles.dot}> • </Text>
                        <Text style={styles.recordDate}>{item.date}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.downloadBtn}>
                    <Download size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Medical Records" showProfile={false} />

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color={theme.colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search records..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <View style={styles.keyInfoSection}>
                <Text style={styles.sectionTitle}>Key Health Info</Text>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Blood Group</Text>
                        <Text style={styles.infoValue}>O+</Text>
                    </View>
                    <View style={[styles.infoItem, styles.infoDivider]}>
                        <Text style={styles.infoLabel}>Weight</Text>
                        <Text style={styles.infoValue}>75 kg</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Height</Text>
                        <Text style={styles.infoValue}>180 cm</Text>
                    </View>
                </View>
            </View>

            <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>Recent Reports</Text>
            </View>

            <FlatList
                data={records}
                keyExtractor={item => item.id}
                renderItem={renderRecordItem}
                contentContainerStyle={styles.listContent}
                ListFooterComponent={<View style={{ height: 100 }} />}
            />

            <TouchableOpacity style={styles.fab}>
                <Plus size={28} color={theme.colors.white} />
                <Text style={styles.fabText}>Upload Report</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    searchContainer: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        paddingHorizontal: theme.spacing.md,
        height: 48,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.light,
    },
    searchInput: {
        flex: 1,
        marginLeft: theme.spacing.sm,
        fontSize: 16,
        color: theme.colors.text,
    },
    keyInfoSection: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        ...theme.shadows.light,
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
    },
    infoDivider: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: theme.colors.border,
    },
    infoLabel: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.primary,
    },
    listHeader: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.sm,
    },
    listContent: {
        paddingHorizontal: theme.spacing.lg,
    },
    card: {
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    recordContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    recordInfo: {
        flex: 1,
    },
    recordTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
    },
    recordMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    recordType: {
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
    dot: {
        color: theme.colors.textSecondary,
    },
    recordDate: {
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
    downloadBtn: {
        padding: theme.spacing.sm,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 24,
        backgroundColor: theme.colors.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 30,
        ...theme.shadows.medium,
    },
    fabText: {
        color: theme.colors.white,
        fontWeight: '700',
        marginLeft: theme.spacing.sm,
        fontSize: 15,
    },
});

export default MedicalRecordsScreen;
