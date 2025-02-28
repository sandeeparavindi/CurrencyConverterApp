// src/components/CurrencyInput.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Menu, Button, Text } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setBaseCurrency, setTargetCurrency, setAmount, swapCurrencies } from '../store/currencySlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CurrencyItemProps {
    code: string;
    onSelect: () => void;
}

const CurrencyItem: React.FC<CurrencyItemProps> = ({ code, onSelect }) => (
    <Menu.Item onPress={onSelect} title={code} />
);

interface CurrencyInputProps {
    currencies: string[];
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ currencies }) => {
    const dispatch = useDispatch();
    const { baseCurrency, targetCurrency, amount } = useSelector(
        (state: RootState) => state.currency
    );

    const [baseMenuVisible, setBaseMenuVisible] = React.useState(false);
    const [targetMenuVisible, setTargetMenuVisible] = React.useState(false);

    const handleAmountChange = (text: string) => {
        const numValue = parseFloat(text) || 0;
        dispatch(setAmount(numValue));
    };

    const handleSwap = () => {
        dispatch(swapCurrencies());
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <TextInput
                    label="Amount"
                    value={amount.toString()}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                    style={styles.amountInput}
                    mode="outlined"
                />

                <View style={styles.currencySelector}>
                    <Menu
                        visible={baseMenuVisible}
                        onDismiss={() => setBaseMenuVisible(false)}
                        anchor={
                            <Button
                                mode="outlined"
                                onPress={() => setBaseMenuVisible(true)}
                                style={styles.currencyButton}
                            >
                                {baseCurrency}
                            </Button>
                        }
                    >
                        {currencies.map((currency) => (
                            <CurrencyItem
                                key={currency}
                                code={currency}
                                onSelect={() => {
                                    dispatch(setBaseCurrency(currency));
                                    setBaseMenuVisible(false);
                                }}
                            />
                        ))}
                    </Menu>
                </View>
            </View>

            <View style={styles.swapContainer}>
                <Button
                    mode="contained"
                    onPress={handleSwap}
                    style={styles.swapButton}
                >
                    <MaterialCommunityIcons name="swap-vertical" size={20} color="white" />
                </Button>
            </View>

            <View style={styles.row}>
                <View style={styles.resultContainer}>
                    <Text style={styles.resultLabel}>Converted to:</Text>
                </View>

                <View style={styles.currencySelector}>
                    <Menu
                        visible={targetMenuVisible}
                        onDismiss={() => setTargetMenuVisible(false)}
                        anchor={
                            <Button
                                mode="outlined"
                                onPress={() => setTargetMenuVisible(true)}
                                style={styles.currencyButton}
                            >
                                {targetCurrency}
                            </Button>
                        }
                    >
                        {currencies.map((currency) => (
                            <CurrencyItem
                                key={currency}
                                code={currency}
                                onSelect={() => {
                                    dispatch(setTargetCurrency(currency));
                                    setTargetMenuVisible(false);
                                }}
                            />
                        ))}
                    </Menu>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    amountInput: {
        flex: 1,
        marginRight: 8,
    },
    currencySelector: {
        width: 100,
    },
    currencyButton: {
        width: '100%',
    },
    swapContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    swapButton: {
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    resultContainer: {
        flex: 1,
        marginRight: 8,
    },
    resultLabel: {
        fontSize: 16,
    },
});

export default CurrencyInput;
