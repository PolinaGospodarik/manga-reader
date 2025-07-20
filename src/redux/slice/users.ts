import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {AuthResponse, UsersState} from "@/types/types";
import {getTokensFromLocalStorage, removeTokensFromLocalStorage, saveTokensToLocalStorage} from "@/utils/authUtils";

const API_URL = 'https://manga-proxy-chi.vercel.app/auth/realms/mangadex/protocol/openid-connect/token';
const CLIENT_ID = 'personal-client-c40f284a-f83f-498e-b8b3-09665758f4a9-f429155c';
const CLIENT_SECRET = '4aJRvTDjXFIWgJhGcdNoxLV4fXF6Wf1I';

function getAuthHeaders() {
    return { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
}
// Логин
export const login = createAsyncThunk<AuthResponse, { username: string; password: string }, { rejectValue: string }>(
    'users/login',
    async ({ username, password }, { rejectWithValue }) => {
        const creds = new URLSearchParams({
            grant_type: 'password',
            username,
            password,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        });
        try {
            const response = await axios.post<AuthResponse>(API_URL, creds, getAuthHeaders());
            const { access_token, refresh_token } = response.data;
            saveTokensToLocalStorage(access_token, refresh_token);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || 'Неверный логин или пароль');
            }
            return rejectWithValue('Неизвестная ошибка');
        }
    }
);

// Обновление токена
export const refreshAccessToken = createAsyncThunk<AuthResponse, { refresh_token: string }, { rejectValue: string }>(
    'users/refreshAccessToken',
    async ({ refresh_token }, { rejectWithValue }) => {
        const creds = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        });
        try {
            const response = await axios.post<AuthResponse>(API_URL, creds, getAuthHeaders());
            const { access_token, refresh_token } = response.data;
            saveTokensToLocalStorage(access_token, refresh_token);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || 'Неизвестная ошибка');
            }
            return rejectWithValue('Неизвестная ошибка');
        }
    }
);


const usersSlice = createSlice({
    name: 'users',
    initialState: {
        user: false,
        loading: false,
        error: null,
        permissions: [] as string[]
    } as UsersState,
    reducers: {
        logout: (state) => {
            state.error = null;
            removeTokensFromLocalStorage();
            state.user= false;
        },
        initializeUser: (state) => {
            const { accessToken } = getTokensFromLocalStorage();
            state.user = !!accessToken;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, {payload}) => {
                state.loading = false;
                state.user = true;
                // state.access_token =payload.access_token;
                // state.refresh_token =payload.refresh_token;
            })
            .addCase(login.rejected, (state, {payload}) => {
                state.loading = false;
                state.user = false;
                state.error = payload || 'Ошибка при выполнении входа';
            })
            .addCase(refreshAccessToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshAccessToken.fulfilled, (state, {payload}) => {
                state.loading = false;
                // state.access_token = payload.access_token;
            })
            .addCase(refreshAccessToken.rejected, (state, {payload}) => {
                state.loading = false;
                state.error = payload || 'Ошибка при обновлении токена';
            })

    }
});

const { actions, reducer } = usersSlice;

export const { logout, initializeUser } = actions;
export default reducer;
