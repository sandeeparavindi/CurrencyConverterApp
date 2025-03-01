import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchHistorical } from '../store/currencySlice';
import RateChart from '../components/RateChart';

const HistoricalRatesScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { baseCurrency, targetCurrency, historicalRates, status } = useSelector(
        (state: RootState) => state.currency
    );

    const [chartData, setChartData] = useState<{
        dates: string[];
        rates: number[];
    }>({
        dates: [],
        rates: [],
    });

    useEffect(() => {
        dispatch(fetchHistorical({
            base: baseCurrency,
            target: targetCurrency,
            days: 7,
        }));
    }, [dispatch, baseCurrency, targetCurrency]);

    useEffect(() => {
        if (Object.keys(historicalRates).length > 0) {
            const dates = Object.keys(historicalRates).sort();
            const rates = dates.map(date =>
                historicalRates[date][targetCurrency] || 0
            );

            setChartData({ dates, rates });
        }
    }, [historicalRates, targetCurrency]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {status === 'loading' ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" />
                        <Text style={styles.loadingText}>Loading historical data...</Text>
                    </View>
                ) : (
                    <RateChart
                        dates={chartData.dates}
                        rates={chartData.rates}
                        baseCurrency={baseCurrency}
                        targetCurrency={targetCurrency}
                    />
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
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
    },
});

export default HistoricalRatesScreen;
