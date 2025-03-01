import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text } from 'react-native-paper';

interface RateChartProps {
    dates: string[];
    rates: number[];
    baseCurrency: string;
    targetCurrency: string;
}

const RateChart: React.FC<RateChartProps> = ({
                                                 dates,
                                                 rates,
                                                 baseCurrency,
                                                 targetCurrency,
                                             }) => {
    const screenWidth = Dimensions.get('window').width - 32;

    if (dates.length === 0 || rates.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No historical data available</Text>
            </View>
        );
    }

    const chartData = {
        labels: dates.map(date => {
            const d = new Date(date);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        }),
        datasets: [
            {
                data: rates,
                color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`,
                strokeWidth: 2,
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 4,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#4775EA',
        },
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {baseCurrency} to {targetCurrency} - Last 7 Days
            </Text>
            <LineChart
                data={chartData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginVertical: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});

export default RateChart;
