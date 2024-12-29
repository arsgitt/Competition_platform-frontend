import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { api } from '../api'; // Импорт API клиента

// Типы состояния
interface AuthState {
    isAuthenticated: boolean;
    username: string | null;
    is_staff: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    success: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!(Cookies.get('username') && Cookies.get('sessionid')),
    username: Cookies.get('username') || null,
    is_staff: !!Cookies.get('is_staff'),
    status: 'idle',
    error: null,
    success: null,
};

// AsyncThunk для входа с использованием API клиента
export const loginAsync = createAsyncThunk(
    'auth/login',
    async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
        try {
            Cookies.remove('csrftoken');
            Cookies.remove('sessionid');

            const response = await api.login.loginCreate({ username, password });
            const is_staff = Cookies.get('is_staff') === 'True';

            return { username, is_staff };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка при входе');
        }
    }
);

// AsyncThunk для регистрации
export const registerAsync = createAsyncThunk(
    'auth/register',
    async (
        { email, username, password }: { email: string; username: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.register.registerCreate({ email, username, password });
            return { username: response.username, is_staff: false };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка при регистрации');
        }
    }
);

// AsyncThunk для выхода
export const logoutAsync = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await api.logout.logoutCreate({});
        Cookies.remove('username');
        Cookies.remove('is_staff');
        Cookies.remove('sessionid');
        return true;
    } catch (error: any) {
        return rejectWithValue(error.message || 'Ошибка при выходе');
    }
});

// AsyncThunk для обновления профиля
export const updateProfileAsync = createAsyncThunk(
    'auth/updateProfile',
    async (data: { email?: string; password?: string }, { rejectWithValue }) => {
        try {
            const response = await api.profile.profileUpdate(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Ошибка обновления профиля');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action: PayloadAction<{ username: string; is_staff: boolean }>) => {
                state.isAuthenticated = true;
                state.username = action.payload.username;
                state.is_staff = action.payload.is_staff;
                state.status = 'succeeded';

                // Сохраняем данные в Cookies
                Cookies.set('username', action.payload.username);
                Cookies.set('is_staff', String(action.payload.is_staff));
            })
            .addCase(loginAsync.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload || 'Ошибка при входе';
            })
            .addCase(registerAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerAsync.fulfilled, (state, action: PayloadAction<{ username: string; is_staff: boolean }>) => {
                state.isAuthenticated = true;
                state.username = action.payload.username;
                state.is_staff = action.payload.is_staff;
                state.status = 'succeeded';

                // Сохраняем данные в Cookies
                Cookies.set('username', action.payload.username);
                Cookies.set('is_staff', String(action.payload.is_staff));
            })
            .addCase(registerAsync.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload || 'Ошибка при регистрации';
            })
            .addCase(logoutAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.username = null;
                state.is_staff = false;
                state.status = 'succeeded';
            })
            .addCase(logoutAsync.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload || 'Ошибка при выходе';
            })
            .addCase(updateProfileAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.success = null;
            })
            .addCase(updateProfileAsync.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = 'succeeded';
                state.success = 'Профиль обновлен успешно';
                state.error = null;
                if (action.payload.username) {
                    state.username = action.payload.username;
                }
            })
            .addCase(updateProfileAsync.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload || 'Ошибка обновления профиля';
                state.success = null;
            });
    },
});

export default authSlice.reducer;
