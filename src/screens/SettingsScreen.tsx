// src/screens/SettingsScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, Divider, Button, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import * as SecureStore from 'expo-secure-store';

const SettingsScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const [darkMode, setDarkMode] = React.useState(false);
    const [notifications, setNotifications] = React.useState(true);
    const [offlineMode, setOfflineMode] = React.useState(false);

    const handleLogout = async () => {
        try {
            // Remove the token from secure storage
            await SecureStore.deleteItemAsync('userToken');

            // Update Redux state
            dispatch(logout());
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>

                <List.Item
                    title="Dark Mode"
                    description="Switch to dark theme"
                    left={props => <List.Icon {...props} icon="brightness-6" />}
                    right={props => (
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                        />
                    )}
                />

                <Divider />

                <List.Item
                    title="Notifications"
                    description="Get alerts for significant rate changes"
                    left={props => <List.Icon {...props} icon="bell-outline" />}
                    right={props => (
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                        />
                    )}
                />

                <Divider />

                <List.Item
                    title="Offline Mode"
                    description="Use cached rates when offline"
                    left={props => <List.Icon {...props} icon="wifi-off" />}
                    right={props => (
                        <Switch
                            value={offlineMode}
                            onValueChange={setOfflineMode}
                        />
                    )}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>

                {isAuthenticated ? (
                    <>
                        <List.Item
                            title="Email"
                            description={user?.email || ''}
                            left={props => <List.Icon {...props} icon="email-outline" />}
                        />

                        <Divider />

                        <List.Item
                            title="Change Password"
                            left={props => <List.Icon {...props} icon="lock-outline" />}
                            onPress={() => {/* Navigate to change password screen */}}
                        />

                        <View style={styles.logoutContainer}>
                            <Button
                                mode="outlined"
                                onPress={handleLogout}
                                style={styles.logoutButton}
                            >
                                Logout
                            </Button>
                        </View>
                    </>
                ) : (
                    <List.Item
                        title="Sign In"
                        description="Login to sync your favorites"
                        left={props => <List.Icon {...props} icon="login" />}
                        onPress={() => {/* Navigate to login screen */}}
                    />
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>

                <List.Item
                    title="Version"
                    description="1.0.0"
                    left={props => <List.Icon {...props} icon="information-outline" />}
                />

                <Divider />

                <List.Item
                    title="Rate this app"
                    left={props => <List.Icon {...props} icon="star-outline" />}
                />

                <Divider />

                <List.Item
                    title="Privacy Policy"
                    left={props => <List.Icon {...props} icon="shield-outline" />}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    section: {
        backgroundColor: 'white',
        marginVertical: 8,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: '#4775EA',
    },
    logoutContainer: {
        padding: 16,
    },
    logoutButton: {
        borderColor: '#ff5252',
        borderWidth: 1,
    },
});

export default SettingsScreen;
