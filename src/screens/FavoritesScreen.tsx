// src/screens/FavoritesScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import FavoritesList from '../components/FavoritesList';

const FavoritesScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Favorite Currency Pairs</Text>
            <FavoritesList />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 16,
    },
});

export default FavoritesScreen;
