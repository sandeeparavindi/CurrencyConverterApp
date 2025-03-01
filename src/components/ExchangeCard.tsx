import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addFavorite } from '../store/favoritesSlice';

const ExchangeCard: React.FC = () => {
    const dispatch = useDispatch();
    const { baseCurrency, targetCurrency, amount, rates, lastUpdated } = useSelector(
        (state: RootState) => state.currency
    );

    const rate = rates[targetCurrency] || 0;
    const convertedAmount = amount * rate;

    const handleAddToFavorites = () => {
        dispatch(addFavorite({
            from: baseCurrency,
            to: targetCurrency,
        }));
    };

    return (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {baseCurrency} to {targetCurrency}
                    </Text>
                    <IconButton
                        icon="star-outline"
                        size={20}
                        onPress={handleAddToFavorites}
                    />
                </View>

                <View style={styles.rateContainer}>
                    <Text style={styles.rateText}>
                        1 {baseCurrency} = {rate.toFixed(4)} {targetCurrency}
                    </Text>
                </View>

                <View style={styles.resultContainer}>
                    <Text style={styles.amountText}>
                        {amount.toFixed(2)} {baseCurrency} =
                    </Text>
                    <Text style={styles.convertedText}>
                        {convertedAmount.toFixed(2)} {targetCurrency}
                    </Text>
                </View>

                {lastUpdated && (
                    <Text style={styles.updatedText}>
                        Last updated: {lastUpdated}
                    </Text>
                )}
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 16,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    rateContainer: {
        marginVertical: 8,
    },
    rateText: {
        fontSize: 16,
        color: '#666',
    },
    resultContainer: {
        marginVertical: 8,
    },
    amountText: {
        fontSize: 16,
    },
    convertedText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 4,
    },
    updatedText: {
        fontSize: 12,
        color: '#888',
        marginTop: 8,
    },
});

export default ExchangeCard;
