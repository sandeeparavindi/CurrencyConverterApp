import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from './currencySlice';
import favoritesReducer from './favoritesSlice';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        currency: currencyReducer,
        favorites: favoritesReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
