// src/api/currencyApi.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Using Frankfurter API as it doesn't require API keys
const API_BASE_URL = 'https://api.frankfurter.app';

export interface ExchangeRateResponse {
    amount: number;
    base: string;
    date: string;
    rates: Record<string, number>;
}

export interface HistoricalRatesResponse {
    amount: number;
    base: string;
    start_date: string;
    end_date: string;
    rates: Record<string, Record<string, number>>;
}

export const fetchLatestRates = async (base: string = 'USD'): Promise<ExchangeRateResponse> => {
    try {
        // Try to get cached rates first
        const cachedRatesStr = await AsyncStorage.getItem(`rates_${base}`);
        const cachedTimestampStr = await AsyncStorage.getItem(`rates_timestamp_${base}`);

        const now = Date.now();
        const cachedTimestamp = cachedTimestampStr ? parseInt(cachedTimestampStr) : 0;
        const cacheExpiry = 3600000; // 1 hour in milliseconds

        // If we have cached rates and they're less than 1 hour old, use them
        if (cachedRatesStr && now - cachedTimestamp < cacheExpiry) {
            return JSON.parse(cachedRatesStr);
        }

        // Otherwise fetch fresh rates
        const response = await axios.get<ExchangeRateResponse>(`${API_BASE_URL}/latest?from=${base}`);

        // Cache the response
        await AsyncStorage.setItem(`rates_${base}`, JSON.stringify(response.data));
        await AsyncStorage.setItem(`rates_timestamp_${base}`, now.toString());

        return response.data;
    } catch (error) {
        console.error('Error fetching latest rates:', error);

        // If we have cached rates, return them as fallback even if they're old
        const cachedRatesStr = await AsyncStorage.getItem(`rates_${base}`);
        if (cachedRatesStr) {
            return JSON.parse(cachedRatesStr);
        }

        throw error;
    }
};

export const fetchHistoricalRates = async (
    base: string = 'USD',
    target: string = 'EUR',
    days: number = 7
): Promise<HistoricalRatesResponse> => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        const formatDate = (date: Date) => {
            return date.toISOString().split('T')[0];
        };

        const url = `${API_BASE_URL}/${formatDate(startDate)}..${formatDate(endDate)}?from=${base}&to=${target}`;
        const response = await axios.get<HistoricalRatesResponse>(url);

        return response.data;
    } catch (error) {
        console.error('Error fetching historical rates:', error);
        throw error;
    }
};

export const getSupportedCurrencies = async (): Promise<string[]> => {
    try {
        // Try to get cached currencies first
        const cachedCurrencies = await AsyncStorage.getItem('supported_currencies');

        if (cachedCurrencies) {
            return JSON.parse(cachedCurrencies);
        }

        // Otherwise fetch fresh currencies
        const response = await axios.get<Record<string, string>>(`${API_BASE_URL}/currencies`);
        const currencies = Object.keys(response.data);

        // Cache the currencies
        await AsyncStorage.setItem('supported_currencies', JSON.stringify(currencies));

        return currencies;
    } catch (error) {
        console.error('Error fetching supported currencies:', error);
        throw error;
    }
};
