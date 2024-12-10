import { configureStore } from '@reduxjs/toolkit';
import playersReducer from './playersSlice';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        players: playersReducer,
        auth: authReducer,
    },
});

export default store;