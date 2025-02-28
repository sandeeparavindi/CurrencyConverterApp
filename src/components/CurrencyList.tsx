import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { POPULAR_CURRENCIES, CurrencyData } from '../hooks/useExchangeRates';
import { RootState } from '../store';
import { addToFavorites, removeFromFavorites } from '../store/favoritesSlice';

interface CurrencyListProps {
    onSelectCurrency: (currency: CurrencyData) => void;
    selectedCurrency?: string;
    showFavoritesOnly?: boolean;
}

const CurrencyList: React.FC<CurrencyListProps> = ({
                                                       onSelectCurrency,
                                                       selectedCurrency,
                                                       showFavoritesOnly = false,
                                                   }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCurrencies, setFilteredCurrencies] = useState<CurrencyData[]>(POPULAR_CURRENCIES);

    const dispatch = useDispatch();
    const { favorites } = useSelector((state: RootState) => state.favorites);

    // Filter currencies based on search query and favorites filter
    useEffect(() => {
        let result = POPULAR_CURRENCIES;

        if (searchQuery) {
            result = POPULAR_CURRENCIES.filter(
                currency =>
                    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    currency.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (showFavoritesOnly) {
            result = result.filter(currency => favorites.includes(currency.code));
        }

        setFilteredCurrencies(result);
    }, [searchQuery, favorites, showFavoritesOnly]);

    const toggleFavorite = (currencyCode: string) => {
        if (favorites.includes(currencyCode)) {
            dispatch(removeFromFavorites(currencyCode));
        } else {
            dispatch(addToFavorites(currencyCode));
        }
    };

    const renderCurrencyItem = ({ item }: { item: CurrencyData }) => {
        const isSelected = selectedCurrency === item.code;
        const isFavorite = favorites.includes(item.code);

        return (
            <TouchableOpacity
                style={[
                    styles.currencyItem,
                    isSelected && styles.selectedItem,
                ]}
                onPress={() => onSelectCurrency(item)}
            >
                <View style={styles.currencyInfo}>
                    <Text style={styles.currencyCode}>{item.code}</Text>
                    <Text style={styles.currencyName}>{item.name}</Text>
                </View>

                <View style={styles.rightSection}>
                    <Text style={styles.currencySymbol}>{item.symbol}</Text>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => toggleFavorite(item.code)}
                    >
                        <Ionicons
                            name={isFavorite ? 'star' : 'star-outline'}
                            size={24}
                            color={isFavorite ? '#FFD700' : '#CCCCCC'}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#CCCCCC" />
            <Text style={styles.emptyText}>
                {showFavoritesOnly
                    ? "You don't have any favorite currencies yet"
                    : "No currencies found for your search"}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Search Box */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search currencies..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#999"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color="#999" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Currency List */}
            <FlatList
                data={filteredCurrencies}
                renderItem={renderCurrencyItem}
                keyExtractor={item => item.code}
                style={styles.list}
                ListEmptyComponent={renderEmptyList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 15,
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 10,
        height: 45,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
    list: {
        flex: 1,
    },
    currencyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    selectedItem: {
        backgroundColor: '#f0f8ff',
    },
    currencyInfo: {
        flex: 1,
    },
    currencyCode: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 2,
    },
    currencyName: {
        fontSize: 14,
        color: '#666',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        fontSize: 18,
        marginRight: 15,
        fontWeight: '500',
    },
    favoriteButton: {
        padding: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 40,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default CurrencyList;

//=================================
//=================================
// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     FlatList,
//     TouchableOpacity,
//     StyleSheet,
//     TextInput,
//     ActivityIndicator,
//     SafeAreaView
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { useExchangeRates } from '../hooks/useExchangeRates';
//
// interface CurrencyListProps {
//     selectedCurrency: string;
//     onSelectCurrency: (currency: string) => void;
//     isSource?: boolean;
// }
//
// const CurrencyList: React.FC<CurrencyListProps> = ({
//                                                        selectedCurrency,
//                                                        onSelectCurrency,
//                                                        isSource = false
//                                                    }) => {
//     const navigation = useNavigation();
//     const { allCurrencies, isLoading } = useExchangeRates();
//     const [searchQuery, setSearchQuery] = useState('');
//     const [filteredCurrencies, setFilteredCurrencies] = useState<{code: string, name: string, symbol: string}[]>([]);
//
//     useEffect(() => {
//         if (allCurrencies.length > 0) {
//             setFilteredCurrencies(allCurrencies);
//         }
//     }, [allCurrencies]);
//
//     useEffect(() => {
//         if (searchQuery.trim() === '') {
//             setFilteredCurrencies(allCurrencies);
//         } else {
//             const query = searchQuery.toLowerCase();
//             const filtered = allCurrencies.filter(
//                 currency =>
//                     currency.code.toLowerCase().includes(query) ||
//                     currency.name.toLowerCase().includes(query)
//             );
//             setFilteredCurrencies(filtered);
//         }
//     }, [searchQuery, allCurrencies]);
//
//     const handleSelectCurrency = (currencyCode: string) => {
//         onSelectCurrency(currencyCode);
//         navigation.goBack();
//     };
//
//     const renderCurrencyItem = ({ item }: { item: {code: string, name: string, symbol: string} }) => (
//         <TouchableOpacity
//             style={[
//                 styles.currencyItem,
//                 selectedCurrency === item.code && styles.selectedItem
//             ]}
//             onPress={() => handleSelectCurrency(item.code)}
//         >
//             <View style={styles.currencyInfo}>
//                 <Text style={styles.currencyCode}>{item.code}</Text>
//                 <Text style={styles.currencyName}>{item.name}</Text>
//             </View>
//             <View style={styles.rightContent}>
//                 <Text style={styles.currencySymbol}>{item.symbol}</Text>
//                 {selectedCurrency === item.code && (
//                     <MaterialIcons name="check" size={20} color="#6200ee" />
//                 )}
//             </View>
//         </TouchableOpacity>
//     );
//
//     if (isLoading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#6200ee" />
//                 <Text style={styles.loadingText}>Loading currencies...</Text>
//             </View>
//         );
//     }
//
//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//                     <MaterialIcons name="arrow-back" size={24} color="#333" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>
//                     {isSource ? 'From Currency' : 'To Currency'}
//                 </Text>
//             </View>
//
//             <View style={styles.searchContainer}>
//                 <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search currency by code or name"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                     autoCapitalize="none"
//                     clearButtonMode="while-editing"
//                 />
//                 {searchQuery.length > 0 && (
//                     <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
//                         <MaterialIcons name="clear" size={20} color="#666" />
//                     </TouchableOpacity>
//                 )}
//             </View>
//
//             <Text style={styles.resultCount}>
//                 {filteredCurrencies.length} currencies available
//             </Text>
//
//             <FlatList
//                 data={filteredCurrencies}
//                 renderItem={renderCurrencyItem}
//                 keyExtractor={(item) => item.code}
//                 initialNumToRender={20}
//                 maxToRenderPerBatch={20}
//                 windowSize={10}
//                 style={styles.list}
//                 contentContainerStyle={styles.listContent}
//             />
//         </SafeAreaView>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f9f9f9',
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderBottomWidth: 1,
//         borderBottomColor: '#e0e0e0',
//         backgroundColor: 'white',
//     },
//     headerTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         marginLeft: 16,
//     },
//     backButton: {
//         padding: 4,
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         backgroundColor: 'white',
//         marginHorizontal: 16,
//         marginVertical: 12,
//         borderRadius: 8,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//     },
//     searchIcon: {
//         marginRight: 8,
//     },
//     searchInput: {
//         flex: 1,
//         height: 40,
//         fontSize: 16,
//     },
//     clearButton: {
//         padding: 4,
//     },
//     resultCount: {
//         marginHorizontal: 16,
//         marginBottom: 8,
//         fontSize: 14,
//         color: '#666',
//     },
//     list: {
//         flex: 1,
//     },
//     listContent: {
//         paddingHorizontal: 16,
//         paddingBottom: 16,
//     },
//     currencyItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 16,
//         paddingHorizontal: 12,
//         backgroundColor: 'white',
//         marginVertical: 4,
//         borderRadius: 8,
//         elevation: 1,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 1,
//     },
//     selectedItem: {
//         backgroundColor: '#f0e6ff',
//         borderColor: '#6200ee',
//         borderWidth: 1,
//     },
//     currencyInfo: {
//         flex: 1,
//     },
//     currencyCode: {
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     currencyName: {
//         fontSize: 14,
//         color: '#666',
//         marginTop: 4,
//     },
//     rightContent: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     currencySymbol: {
//         fontSize: 16,
//         marginRight: 8,
//         color: '#444',
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     loadingText: {
//         marginTop: 16,
//         fontSize: 16,
//         color: '#666',
//     }
// });
//
// export default CurrencyList;
