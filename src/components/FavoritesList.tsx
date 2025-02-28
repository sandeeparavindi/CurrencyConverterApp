// src/components/FavoritesList.tsx
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeFavorite } from '../store/favoritesSlice';
import { fetchLatestRates } from '../api/currencyApi';

const FavoritesList: React.FC = () => {
    const dispatch = useDispatch();
    const { pairs } = useSelector((state: RootState) => state.favorites);
    const { rates } = useSelector((state: RootState) => state.currency);

    const [localRates, setLocalRates] = React.useState<Record<string, Record<string, number>>>({});

    React.useEffect(() => {
        const fetchRatesForFavorites = async () => {
            const newRates: Record<string, Record<string, number>> = {};

            for (const pair of pairs) {
                try {
                    const rateData = await fetchLatestRates(pair.from);
                    newRates[pair.from] = rateData.rates;
                } catch (error) {
                    console.error(`Error fetching rates for ${pair.from}:`, error);
                }
            }

            setLocalRates(newRates);
        };

        fetchRatesForFavorites();
    }, [pairs]);

    const getRate = (from: string, to: string): number => {
        if (localRates[from] && localRates[from][to]) {
            return localRates[from][to];
        }
        return 0;
    };

    const handleRemove = (id: string) => {
        dispatch(removeFavorite(id));
    };

    const renderItem = ({ item }: { item: typeof pairs[0] }) => {
        const rate = getRate(item.from, item.to);

        return (
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.cardHeader}>
                        <Text style={styles.pairName}>
                            {item.name || `${item.from}/${item.to}`}
                        </Text>
                        <IconButton
                            icon="delete-outline"
                            size={20}
                            onPress={() => handleRemove(item.id)}
                        />
                    </View>

                    <View style={styles.rateContainer}>
                        <Text style={styles.rateText}>
                            1 {item.from} = {rate.toFixed(4)} {item.to}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    if (pairs.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text>No favorite currency pairs yet</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={pairs}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pairName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    rateContainer: {
        marginTop: 8,
    },
    rateText: {
        fontSize: 18,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
});

export default FavoritesList;
