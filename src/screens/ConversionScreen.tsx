// src/screens/ConversionScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchRates } from '../store/currencySlice';
import CurrencyInput from '../components/CurrencyInput';
import ExchangeCard from '../components/ExchangeCard';
import { getSupportedCurrencies } from '../api/currencyApi';

const ConversionScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { baseCurrency, status, error } = useSelector(
        (state: RootState) => state.currency
    );

    const [currencies, setCurrencies] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCurrencies = async () => {
            try {
                const supportedCurrencies = await getSupportedCurrencies();
                setCurrencies(supportedCurrencies);
            } catch (error) {
                console.error('Failed to load currencies:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCurrencies();
    }, []);

    useEffect(() => {
        dispatch(fetchRates(baseCurrency));
    }, [dispatch, baseCurrency]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading currencies...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <CurrencyInput currencies={currencies} />

                {status === 'loading' ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" />
                        <Text>Fetching rates...</Text>
                    </View>
                ) : status === 'failed' ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Error: {error}</Text>
                    </View>
                ) : (
                    <ExchangeCard />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
    },
    loadingContainer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 8,
    },
    errorContainer: {
        padding: 16,
        backgroundColor: '#ffebee',
        borderRadius: 8,
        marginVertical: 16,
    },
    errorText: {
        color: '#c62828',
    },
});

export default ConversionScreen;
