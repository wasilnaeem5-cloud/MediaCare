import { Camera, ChevronRight, HelpCircle, LogOut, Moon, Phone, Sun, User } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';

const ProfileSettingScreen = ({ navigation }) => {
    const { user: authUser, logout, updateUser } = useAuth();
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const [user, setUser] = useState({
        name: authUser?.name || '',
        email: authUser?.email || '',
        phone: authUser?.phone || '',
        address: authUser?.address || 'Not set',
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!user.name || !user.email) {
            Alert.alert('Error', 'Name and Email are required');
            return;
        }
        setLoading(true);
        try {
            await updateUser(user);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            console.log('[Profile] Logout initiated');
            // Using a simple confirm for better reliability across platforms
            logout();
        } catch (error) {
            console.error('[Profile] Logout click error', error);
        }
    };

    const SettingItem = ({ icon: Icon, title, onPress, color = theme.colors.text, rightElement }) => (
        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.colors.surface }]} onPress={onPress}>
            <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: color + '15' }]}>
                    <Icon size={22} color={color} />
                </View>
                <Text style={[styles.settingTitle, { color }]}>{title}</Text>
            </View>
            {rightElement || <ChevronRight size={20} color={theme.colors.textSecondary} />}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={[styles.profileHeader, { backgroundColor: theme.colors.surface }]}>
                        <View style={styles.avatarContainer}>
                            <View style={[styles.avatar, { backgroundColor: theme.colors.softBlue }]}>
                                <User size={60} color={theme.colors.primary} />
                            </View>
                            <TouchableOpacity style={styles.cameraBtn}>
                                <Camera size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.userName, { color: theme.colors.text }]}>{authUser?.name || 'User'}</Text>
                        <Text style={styles.userEmail}>{authUser?.email || 'email@example.com'}</Text>
                        <View style={styles.roleTag}>
                            <Text style={styles.roleText}>{authUser?.role || 'patient'}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Settings & App</Text>

                        <SettingItem
                            icon={isDarkMode ? Sun : Moon}
                            title="Dark Mode"
                            color={isDarkMode ? '#FACC15' : '#6366F1'}
                            rightElement={
                                <Switch
                                    value={isDarkMode}
                                    onValueChange={toggleTheme}
                                    trackColor={{ false: '#CBD5E1', true: theme.colors.primary }}
                                    thumbColor="#FFF"
                                />
                            }
                        />

                        <SettingItem icon={HelpCircle} title="Help & FAQ" onPress={() => navigation.navigate('FAQ')} />

                        <SettingItem
                            icon={LogOut}
                            title="Logout current session"
                            onPress={handleLogout}
                            color={theme.colors.error}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Personal Information</Text>
                        <CustomInput label="Full Name" value={user.name} onChangeText={(v) => setUser({ ...user, name: v })} icon={User} />
                        <CustomInput label="Phone Number" value={user.phone} onChangeText={(v) => setUser({ ...user, phone: v })} icon={Phone} keyboardType="phone-pad" />
                        <CustomButton title="Save Changes" onPress={handleSave} loading={loading} style={styles.saveBtn} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    avatarContainer: { position: 'relative', marginBottom: 15 },
    avatar: {
        width: 120, height: 120, borderRadius: 60,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 4, borderColor: '#FFF',
    },
    cameraBtn: {
        position: 'absolute', bottom: 5, right: 5,
        backgroundColor: '#5E60CE', width: 36, height: 36,
        borderRadius: 18, justifyContent: 'center', alignItems: 'center',
        borderWidth: 3, borderColor: '#FFF',
    },
    userName: { fontSize: 24, fontWeight: '900' },
    userEmail: { fontSize: 14, color: '#94A3B8', marginTop: 4 },
    roleTag: {
        marginTop: 12, paddingHorizontal: 12, paddingVertical: 4,
        borderRadius: 10, backgroundColor: 'rgba(94, 96, 206, 0.1)',
    },
    roleText: { color: '#5E60CE', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
    section: { marginTop: 30, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 15 },
    saveBtn: { marginTop: 10 },
    settingItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 16, borderRadius: 20, marginBottom: 12,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
    },
    settingLeft: { flexDirection: 'row', alignItems: 'center' },
    settingIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    settingTitle: { fontSize: 16, fontWeight: '700' },
});

export default ProfileSettingScreen;
