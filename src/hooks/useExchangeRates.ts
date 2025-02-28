import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Define types for the exchange rates
export interface ExchangeRates {
    base: string;
    date: string;
    rates: {
        [key: string]: number;
    };
    timestamp: number;
}

export interface CurrencyData {
    code: string;
    name: string;
    symbol: string;
}

// Popular currencies with their symbols and names
export const POPULAR_CURRENCIES: CurrencyData[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
];

// Create a map of currency codes to currency data for quick lookups
export const CURRENCY_MAP: { [key: string]: CurrencyData } = {};
POPULAR_CURRENCIES.forEach(currency => {
    CURRENCY_MAP[currency.code] = currency;
});

const API_URL = 'https://api.frankfurter.app/latest';
const STORAGE_KEY = 'exchange_rates_data';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

export const useExchangeRates = (baseCurrency = 'USD') => {
    const [rates, setRates] = useState<ExchangeRates | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isOffline, setIsOffline] = useState<boolean>(false);

    const fetchRates = async (base: string) => {
        setLoading(true);
        setError(null);

        try {
            // Check network connectivity
            const netInfo = await NetInfo.fetch();
            setIsOffline(!netInfo.isConnected);

            if (!netInfo.isConnected) {
                // If offline, try to load cached rates
                const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
                if (cachedData) {
                    const parsedData: ExchangeRates = JSON.parse(cachedData);
                    setRates(parsedData);
                    setLoading(false);
                    return;
                } else {
                    throw new Error('No internet connection and no cached rates available');
                }
            }

            // Online, fetch fresh rates
            const response = await fetch(`${API_URL}?from=${base}`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();

            // Add timestamp for cache expiry checking
            const ratesWithTimestamp: ExchangeRates = {
                ...data,
                timestamp: new Date().getTime()
            };

            // Save to state and cache
            setRates(ratesWithTimestamp);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ratesWithTimestamp));

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            // Try to load cached rates as fallback
            try {
                const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
                if (cachedData) {
                    const parsedData: ExchangeRates = JSON.parse(cachedData);
                    setRates(parsedData);
                }
            } catch (cacheErr) {
                // If we can't load cached data either, we're out of options
                console.error('Failed to load cached exchange rates:', cacheErr);
            }
        } finally {
            setLoading(false);
        }
    };

    // Check if cached rates are expired
    const isCacheExpired = (timestamp: number): boolean => {
        const now = new Date().getTime();
        return now - timestamp > CACHE_EXPIRY;
    };

    // Load rates on mount and when baseCurrency changes
    useEffect(() => {
        const loadRates = async () => {
            try {
                // Try to get cached rates first
                const cachedData = await AsyncStorage.getItem(STORAGE_KEY);

                if (cachedData) {
                    const parsedData: ExchangeRates = JSON.parse(cachedData);

                    // If base currency is different or cache is expired, fetch new rates
                    if (parsedData.base !== baseCurrency || isCacheExpired(parsedData.timestamp)) {
                        fetchRates(baseCurrency);
                    } else {
                        // Use cached rates
                        setRates(parsedData);
                        setLoading(false);
                    }
                } else {
                    // No cached data, fetch new rates
                    fetchRates(baseCurrency);
                }
            } catch (err) {
                console.error('Error loading rates:', err);
                fetchRates(baseCurrency);
            }
        };

        loadRates();

        // Set up network status listener
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOffline(!state.isConnected);

            // If we're coming back online and we were offline, refresh the rates
            if (state.isConnected && isOffline) {
                fetchRates(baseCurrency);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [baseCurrency]);

    // Function to convert between currencies
    const convertCurrency = (amount: number, from: string, to: string): number => {
        if (!rates || !rates.rates) return 0;

        // If converting to the base currency
        if (to === rates.base) {
            return amount / (rates.rates[from] || 1);
        }

        // If converting from the base currency
        if (from === rates.base) {
            return amount * (rates.rates[to] || 1);
        }

        // Converting between two non-base currencies
        const amountInBase = amount / (rates.rates[from] || 1);
        return amountInBase * (rates.rates[to] || 1);
    };

    return {
        rates,
        loading,
        error,
        isOffline,
        fetchRates,
        convertCurrency,
    };
};

//========================================
//=======================================================================

