import { Camera, ChevronRight, HelpCircle, LogOut, Mail, MapPin, Phone, Settings, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { storage } from '../utils/storage';
import { theme } from '../utils/theme';

const ProfileSettingScreen = ({ navigation }) => {
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 890',
        address: '123 Health St, Medical City',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const userData = await storage.getUser();
        if (userData) {
            setUser(prev => ({ ...prev, ...userData }));
        }
    };

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Success', 'Profile updated successfully!');
        }, 1000);
    };

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                onPress: async () => {
                    await storage.clearAll();
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Auth' }],
                    });
                }
            }
        ]);
    };

    const SettingItem = ({ icon: Icon, title, onPress, color = theme.colors.text }) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress}>
            <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: color + '15' }]}>
                    <Icon size={22} color={color} />
                </View>
                <Text style={[styles.settingTitle, { color }]}>{title}</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <User size={60} color={theme.colors.primary} />
                        </View>
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Camera size={20} color={theme.colors.white} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <CustomInput
                        label="Full Name"
                        value={user.name}
                        onChangeText={(val) => setUser({ ...user, name: val })}
                        icon={User}
                    />
                    <CustomInput
                        label="Email Address"
                        value={user.email}
                        onChangeText={(val) => setUser({ ...user, email: val })}
                        icon={Mail}
                        keyboardType="email-address"
                    />
                    <CustomInput
                        label="Phone Number"
                        value={user.phone}
                        onChangeText={(val) => setUser({ ...user, phone: val })}
                        icon={Phone}
                        keyboardType="phone-pad"
                    />
                    <CustomInput
                        label="Address"
                        value={user.address}
                        onChangeText={(val) => setUser({ ...user, address: val })}
                        icon={MapPin}
                    />
                    <CustomButton
                        title="Save Changes"
                        onPress={handleSave}
                        loading={loading}
                        style={styles.saveBtn}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <SettingItem icon={Settings} title="General Settings" onPress={() => { }} />
                    <SettingItem icon={HelpCircle} title="Help & FAQ" onPress={() => navigation.navigate('FAQ')} />
                    <SettingItem
                        icon={LogOut}
                        title="Logout"
                        onPress={handleLogout}
                        color={theme.colors.error}
                    />
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
    scrollContent: {
        paddingBottom: theme.spacing.xxl,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xxl,
        backgroundColor: theme.colors.white,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        ...theme.shadows.light,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: theme.spacing.md,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.softBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: theme.colors.white,
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: theme.colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: theme.colors.white,
    },
    userName: {
        fontSize: 22,
        fontWeight: '800',
        color: theme.colors.text,
    },
    userEmail: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    section: {
        marginTop: theme.spacing.xl,
        paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    saveBtn: {
        marginTop: theme.spacing.sm,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.white,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
        ...theme.shadows.light,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileSettingScreen;
