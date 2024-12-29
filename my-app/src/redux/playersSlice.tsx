// src/redux/threatsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, unauthApi } from '../api';
import Cookies from 'js-cookie';

const initialState = {
    player: {
        f_name: '',
        l_name: '',
        date_birthday: '',
        image_player_url: '',
        birth_place: '',
        weight: 0,
        height: 0,
        position: '',
        number: 0,
    },
    loading: false,
    error: null,
    inputValue: '',
    players: [],
    currentPlayer: null,
    currentTeamId: null,
    currentCount: 0,
    status: 'idle', // idle | loading | succeeded | failed
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

export const fetchPlayerById = createAsyncThunk(
    'players/fetchPlayerById',
    async (playerId: string, { rejectWithValue }) => {
        try {
            const response = await unauthApi.players.playersRead(playerId); // Предположим, что есть такой метод
            if (!response) {
                throw new Error('Ошибка при загрузке данных');
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || 'Ошибка при загрузке данных');
        }
    }
);


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
        const response = await unauthApi.players.playersList({ l_name: inputValue });
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

// Fetch player data
export const fetchPlayer = createAsyncThunk(
    'players/fetchPlayer',
    async (id, { rejectWithValue }) => {
        try {
            const sessionid = Cookies.get('sessionid');
            const response = await unauthApi.players.playersRead(id);
            Cookies.set('sessionid', sessionid);
            return response.data;
        } catch (err) {
            if (err.response?.status === 403) {
                return rejectWithValue('Forbidden');
            } else if (err.response?.status === 404) {
                return rejectWithValue('Not Found');
            }
            return rejectWithValue('Failed to load player data.');
        }
    }
);

// Create or update player
export const savePlayer = createAsyncThunk(
    'players/savePlayer',
    async (playerData, { rejectWithValue, getState }) => {
        try {
            const { id, player } = playerData;
            let response;
            if (id) {
                // Update player
                response = await api.players.playersUpdateUpdate(id, player, {
                    headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
                });
            } else {
                // Create player
                response = await api.players.playersCreateCreate(player, {
                    headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
                });
            }
            return response.data;
        } catch (err) {
            if (err.response?.status === 403) {
                return rejectWithValue('Forbidden');
            } else if (err.response?.status === 404) {
                return rejectWithValue('Not Found');
            }
            return rejectWithValue('Failed to save player.');
        }
    }
);


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
            // fetchPlayerById
            .addCase(fetchPlayerById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPlayerById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentPlayer = action.payload; // Создать поле для текущего игрока
            })
            .addCase(fetchPlayerById.rejected, (state, action) => {
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
            })
            // Handle fetch player
            .addCase(fetchPlayer.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPlayer.fulfilled, (state, action) => {
                state.loading = false;
                state.player = action.payload;
            })
            .addCase(fetchPlayer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle save player
            .addCase(savePlayer.pending, (state) => {
                state.loading = true;
            })
            .addCase(savePlayer.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(savePlayer.rejected, (state, action) => {
                state.loading = false;
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