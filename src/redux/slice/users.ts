import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {AuthResponse, UsersState} from "../../types/types";
import {getTokensFromLocalStorage, removeTokensFromLocalStorage, saveTokensToLocalStorage} from "../../utils/authUtils";

const API_URL = 'https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token';
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
            // Сохраняем токены в localStorage
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
            // Сохраняем обновлённые токены в localStorage
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

// export const fetchPermissions = createAsyncThunk<string[], undefined, { rejectValue: string }>(
//     'users/fetchPermissions',
//     async (_, {rejectWithValue}) => {
//         try{
//             const {accessToken} = getTokensFromLocalStorage();
//             if (!accessToken){
//                 return rejectWithValue('Токен не найден');
//             }
//             const response = await axios.get("https://api.mangadex.org/auth/check", {
//                 headers:{
//                     Authorization: `Bearer ${accessToken}`,
//                 }
//             });
//             console.log(response.data.permissions);
//             return response.data.permissions;
//         }catch (error) {
//             if (axios.isAxiosError(error)) {
//                 return rejectWithValue(error.response?.data.message || 'Неизвестная ошибка');
//             }
//             return rejectWithValue('Неизвестная ошибка');
//         }
//     }
// );


const usersSlice = createSlice({
    name: 'users',
    initialState: {
        // access_token: getTokensFromLocalStorage().accessToken,
        // refresh_token:getTokensFromLocalStorage().refreshToken,
        loading: false,
        error: null,
        permissions: [] as string[]
    } as UsersState,
    reducers: {
        logout: (state) => {
            state.error = null;
            removeTokensFromLocalStorage();
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
                // state.access_token =payload.access_token;
                // state.refresh_token =payload.refresh_token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при выполнении входа';
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
            // .addCase(fetchPermissions.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(fetchPermissions.fulfilled, (state, { payload }) => {
            //     state.loading = false;
            //     state.permissions = payload; // Заполняем permissions
            // })
            // .addCase(fetchPermissions.rejected, (state, { payload }) => {
            //     state.loading = false;
            //     state.error = payload || 'Ошибка при получении разрешений';
            // });
    }
});

const { actions, reducer } = usersSlice;

export const { logout } = actions;
export default reducer;
