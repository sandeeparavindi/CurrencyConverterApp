import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import * as SecureStore from 'expo-secure-store';

interface LoginScreenProps {
    navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const userData = {
                user: {
                    id: '123',
                    email,
                },
                token: 'mock-jwt-token',
            };

            await SecureStore.setItemAsync('userToken', userData.token);

            dispatch(login(userData));
        } catch (err) {
            setError('Login failed. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Currency Converter</Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                    mode="outlined"
                />

                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    mode="outlined"
                />

                <Button
                    mode="contained"
                    onPress={handleLogin}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.button}
                >
                    Login
                </Button>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                    style={styles.linkContainer}
                >
                    <Text style={styles.link}>
                        Don't have an account? Register
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Main')}
                    style={styles.skipContainer}
                >
                    <Text style={styles.skipText}>
                        Skip login for now
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    formContainer: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginVertical: 16,
        paddingVertical: 8,
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center',
    },
    linkContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    link: {
        color: '#4775EA',
    },
    skipContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    skipText: {
        color: '#757575',
    },
});

export default LoginScreen;
