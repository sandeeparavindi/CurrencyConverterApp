import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchLatestRates, fetchHistoricalRates, ExchangeRateResponse, HistoricalRatesResponse } from '../api/currencyApi';

interface CurrencyState {
    baseCurrency: string;
    targetCurrency: string;
    amount: number;
    rates: Record<string, number>;
    historicalRates: Record<string, Record<string, number>>;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    lastUpdated: string | null;
}

const initialState: CurrencyState = {
    baseCurrency: 'USD',
    targetCurrency: 'EUR',
    amount: 1,
    rates: {},
    historicalRates: {},
    status: 'idle',
    error: null,
    lastUpdated: null,
};

export const fetchRates = createAsyncThunk(
    'currency/fetchRates',
    async (base: string) => {
        const response = await fetchLatestRates(base);
        return response;
    }
);

export const fetchHistorical = createAsyncThunk(
    'currency/fetchHistorical',
    async ({ base, target, days }: { base: string; target: string; days: number }) => {
        const response = await fetchHistoricalRates(base, target, days);
        return response;
    }
);

const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setBaseCurrency: (state, action: PayloadAction<string>) => {
            state.baseCurrency = action.payload;
        },
        setTargetCurrency: (state, action: PayloadAction<string>) => {
            state.targetCurrency = action.payload;
        },
        setAmount: (state, action: PayloadAction<number>) => {
            state.amount = action.payload;
        },
        swapCurrencies: (state) => {
            const temp = state.baseCurrency;
            state.baseCurrency = state.targetCurrency;
            state.targetCurrency = temp;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRates.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.rates = action.payload.rates;
                state.lastUpdated = action.payload.date;
            })
            .addCase(fetchRates.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch rates';
            })
            .addCase(fetchHistorical.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchHistorical.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.historicalRates = action.payload.rates;
            })
            .addCase(fetchHistorical.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch historical rates';
            });
    },
});

export const { setBaseCurrency, setTargetCurrency, setAmount, swapCurrencies } = currencySlice.actions;
export default currencySlice.reducer;
