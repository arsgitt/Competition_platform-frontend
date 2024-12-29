import { configureStore } from '@reduxjs/toolkit';
import playersReducer from './playersSlice';
import authReducer from './authSlice';
import teamReducer from './teamSlice';

const store = configureStore({
    reducer: {
        players: playersReducer,
        auth: authReducer,
        team: teamReducer,
    },
});

export default store;