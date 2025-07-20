import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AddToLibrariesParams, Library, LibraryItem } from "@/types/types";
import {getTokensFromLocalStorage} from "@/utils/authUtils";

const BASE_URL = 'https://manga-proxy-chi.vercel.app/proxy';

export const addToLibrary = createAsyncThunk<
    LibraryItem,
    AddToLibrariesParams,
    { rejectValue: string }
>(
    'favorites/addToFavorites',
    async ({ mangaId, status = 'reading', sessionToken }, { rejectWithValue }) => {
        try {
            await axios.post(
                `${BASE_URL}/manga/${mangaId}/status`,
                { status },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionToken}`,
                    },
                }
            );
            return { mangaId, status };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Ошибка при добавлении в избранное');
        }
    }
);

export const fetchLibraries = createAsyncThunk<
    LibraryItem[],
    string,
    { rejectValue: string }
>(
    'favorites/fetchFavorites',
    async (status, { rejectWithValue }) => {
        const { accessToken } = getTokensFromLocalStorage();

        if (!accessToken) {
            return rejectWithValue('Пользователь не авторизован');
        }

        try {
            const response = await axios.get(
                `https://api.mangadex.org/manga/status?status=${status.toLowerCase()}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const data = response.data.statuses;
            console.log('fetchLibraries response:', response.data);


            const validStatuses = ['reading', 'on_hold', 'plan_to_read', 'dropped', 're_reading', 'completed'] as const;
            type ValidStatus = typeof validStatuses[number];

            const libraries: LibraryItem[] = Object.entries(data).map(([mangaId, status]) => {
                if (validStatuses.includes(status as ValidStatus)) {
                    return {
                        mangaId,
                        status: status as ValidStatus,
                    };
                }
                return {
                    mangaId,
                    status: undefined,
                };
            });

            return libraries;
        } catch (error: any) {
            return rejectWithValue('Не удалось загрузить избранное');
        }
    }
);

// export const removeFromLibrary = createAsyncThunk<
//     string,
//     { mangaId: string, sessionToken: string },
//     { rejectValue: string }
// >(
//     'favorites/removeFromFavorites',
//     async ({ mangaId, sessionToken }, { rejectWithValue }) => {
//         try {
//             await axios.post(
//                 `${BASE_URL}/manga/${mangaId}/status`,
//                 { status: null },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${sessionToken}`,
//                     },
//                 }
//             );
//             return mangaId;
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data || 'Ошибка при удалении из избранного');
//         }
//     }
// );

const initialState: Library = {
    libraries: [],
    loading: false,
    error: null,
};

const librariesSlice = createSlice({
    name: 'libraries',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToLibrary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToLibrary.fulfilled, (state, { payload }) => {
                state.loading = false;

                const existingIndex = state.libraries.findIndex(f => f.mangaId === payload.mangaId);
                if (existingIndex !== -1) {
                    state.libraries[existingIndex] = payload;
                } else {
                    state.libraries.push(payload);
                }
            })
            .addCase(addToLibrary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Неизвестная ошибка';
            })

            .addCase(fetchLibraries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLibraries.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.libraries = payload;
            })
            .addCase(fetchLibraries.rejected, (state, {payload}) => {
                state.loading = false;
                state.error = payload || 'Произошла ошибка';
            })

            // .addCase(removeFromLibrary.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(removeFromLibrary.fulfilled, (state, { payload: mangaId }) => {
            //     state.libraries = state.libraries.filter(item => item.mangaId !== mangaId);
            // })
            // .addCase(removeFromLibrary.rejected, (state, {payload}) => {
            //     state.loading = false;
            //     state.error = payload || 'Произошла ошибка';
            // })

    },
});

const { actions, reducer } = librariesSlice;
export const {  } = actions;
export default reducer;
