import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {TAuthResponse, TUsersState} from "@/types/types";
import {getTokensFromLocalStorage, removeTokensFromLocalStorage, saveTokensToLocalStorage} from "@/utils/authUtils";

const API_URL = 'https://manga-proxy-chi.vercel.app/auth/realms/mangadex/protocol/openid-connect/token';
const CLIENT_ID = 'personal-client-c40f284a-f83f-498e-b8b3-09665758f4a9-f429155c';
const CLIENT_SECRET = '4aJRvTDjXFIWgJhGcdNoxLV4fXF6Wf1I';

function getAuthHeaders() {
    return { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
}
// Логин
export const login = createAsyncThunk<TAuthResponse, { username: string; password: string }, { rejectValue: string }>(
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
            const response = await axios.post<TAuthResponse>(API_URL, creds, getAuthHeaders());
            const { access_token, refresh_token } = response.data;
            saveTokensToLocalStorage(access_token, refresh_token);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || 'Incorrect login or password');
            }
            return rejectWithValue('Unknown error');
        }
    }
);

// Обновление токена
export const refreshAccessToken = createAsyncThunk<TAuthResponse, { refresh_token: string }, { rejectValue: string }>(
    'users/refreshAccessToken',
    async ({ refresh_token }, { rejectWithValue }) => {
        const creds = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        });
        try {
            const response = await axios.post<TAuthResponse>(API_URL, creds, getAuthHeaders());
            const { access_token, refresh_token } = response.data;
            saveTokensToLocalStorage(access_token, refresh_token);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || 'Unknown error');
            }
            return rejectWithValue('Unknown error');
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
    } as TUsersState,
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
            .addCase(login.fulfilled, (state) => {
                state.loading = false;
                state.user = true;
            })
            .addCase(login.rejected, (state, {payload}) => {
                state.loading = false;
                state.user = false;
                state.error = payload || 'Error while logging in';
            })
            .addCase(refreshAccessToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshAccessToken.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(refreshAccessToken.rejected, (state, {payload}) => {
                state.loading = false;
                state.error = payload || 'Error updating token';
            })

    }
});

const { actions, reducer } = usersSlice;

export const { logout, initializeUser } = actions;
export default reducer;
