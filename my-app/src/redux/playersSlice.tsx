// src/redux/threatsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    inputValue: '',
    players: [],
};

const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        setPlayers: (state, action) => {
            state.players = action.payload;
        },
        setInputValue: (state, action) => {
            state.inputValue = action.payload;
        }
    },
});

export const {
    setPlayers,
    setInputValue,
} = playersSlice.actions;

export default playersSlice.reducer;