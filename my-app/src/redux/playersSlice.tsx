// src/redux/threatsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, unauthApi } from '../api';
import Cookies from 'js-cookie';

const initialState = {
    inputValue: '',
    players: [],
    currentTeamId: null,
    currentCount: 0,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
};

// Async thunks
export const fetchPlayers = createAsyncThunk('players/fetchPlayers', async (_, { rejectWithValue }) => {
    try {
        const sessionid = Cookies.get('sessionid');
        const response = await unauthApi.players.playersList();
        Cookies.set('sessionid', sessionid);
        return response.data.filter((item) => item.pk !== undefined);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchTeamCount = createAsyncThunk('players/fetchTeamCount', async (_, { rejectWithValue }) => {
    try {
        const response = await api.requestList.requestListList();
        const { draft_request_id, count_players_in_draft } = response.data;
        return { draft_request_id, count_players_in_draft };
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const searchPlayers = createAsyncThunk('players/searchPlayers', async (inputValue, { rejectWithValue }) => {
    try {
        const response = await api.players.playersList({ l_name: inputValue });
        return response.data.filter((item) => item.pk !== undefined);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const addPlayer = createAsyncThunk('players/addPlayer', async (playerId, { getState, rejectWithValue }) => {
    try {
        const csrfToken = Cookies.get('csrftoken');
        const response = await api.players.playersAddCreate(playerId, {}, {
            headers: {
                'X-CSRFToken': csrfToken,
            },
        });

        if (response.status === 200) {
            const state = getState();
            const updatedPlayers = state.players.players.filter((player) => player.pk !== playerId);
            return {
                draft_request_id: response.data.draft_request_id,
                count_players_in_draft: state.players.currentCount + 1,
                players: updatedPlayers,
            };
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

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
    extraReducers: (builder) => {
        builder
            // fetchPlayers
            .addCase(fetchPlayers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPlayers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.players = action.payload;
            })
            .addCase(fetchPlayers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // fetchTeamCount
            .addCase(fetchTeamCount.fulfilled, (state, action) => {
                state.currentTeamId = action.payload.draft_request_id;
                state.currentCount = action.payload.count_players_in_draft;
            })
            .addCase(fetchTeamCount.rejected, (state, action) => {
                state.error = action.payload;
            })
            // searchPlayers
            .addCase(searchPlayers.fulfilled, (state, action) => {
                state.players = action.payload;
            })
            .addCase(searchPlayers.rejected, (state, action) => {
                state.error = action.payload;
            })
            // addPlayer
            .addCase(addPlayer.fulfilled, (state, action) => {
                state.currentTeamId = action.payload.draft_request_id;
                state.currentCount = action.payload.count_players_in_draft;
                state.players = action.payload.players;
            })
            .addCase(addPlayer.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const {
    setPlayers,
    setInputValue,
    setCurrentTeamId,
    setCurrentCount,
} = playersSlice.actions;

export default playersSlice.reducer;