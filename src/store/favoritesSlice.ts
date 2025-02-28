// src/store/favoritesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesPair {
    id: string;
    from: string;
    to: string;
    name?: string;
}

interface FavoritesState {
    pairs: FavoritesPair[];
}

const initialState: FavoritesState = {
    pairs: [],
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<{ from: string; to: string; name?: string }>) => {
            const { from, to, name } = action.payload;
            const id = `${from}-${to}`;

            // Check if already exists
            if (!state.pairs.some(pair => pair.id === id)) {
                state.pairs.push({ id, from, to, name });
            }
        },
        removeFavorite: (state, action: PayloadAction<string>) => {
            state.pairs = state.pairs.filter(pair => pair.id !== action.payload);
        },
        renameFavorite: (state, action: PayloadAction<{ id: string; name: string }>) => {
            const { id, name } = action.payload;
            const pairIndex = state.pairs.findIndex(pair => pair.id === id);

            if (pairIndex !== -1) {
                state.pairs[pairIndex].name = name;
            }
        },
    },
});

export const { addFavorite, removeFavorite, renameFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
