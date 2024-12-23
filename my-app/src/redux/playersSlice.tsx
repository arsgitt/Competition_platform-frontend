// src/redux/threatsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    inputValue: '',
    players: [],
    currentTeamId: null,
    currentCount: 0,
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
        },
        setCurrentTeamId: (state, action) => {
            state.currentTeamId = action.payload;
        },
        setCurrentCount: (state, action) => {
            state.currentCount = action.payload;
        },
    },
});

export const {
    setPlayers,
    setInputValue,
    setCurrentTeamId,
    setCurrentCount,
} = playersSlice.actions;

export default playersSlice.reducer;