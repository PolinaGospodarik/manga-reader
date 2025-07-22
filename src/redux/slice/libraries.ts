import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { TAddToLibrariesParams, TLibrary, TLibraryItem } from "@/types/types";
import {getTokensFromLocalStorage} from "@/utils/authUtils";

const BASE_URL = 'https://manga-proxy-chi.vercel.app/proxy';

export const addToLibrary = createAsyncThunk<
    TLibraryItem,
    TAddToLibrariesParams,
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
            return rejectWithValue(error.response?.data || 'Error adding to libraries');
        }
    }
);

export const fetchLibraries = createAsyncThunk<
    TLibraryItem[],
    string,
    { rejectValue: string }
>(
    'favorites/fetchFavorites',
    async (status, { rejectWithValue }) => {
        const { accessToken } = getTokensFromLocalStorage();

        if (!accessToken) {
            return rejectWithValue('User is not authorized');
        }

        try {
            const response = await axios.get(
                `${BASE_URL}/manga/status?status=${status.toLowerCase()}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const data = response.data.statuses;

            const validStatuses = ['reading', 'on_hold', 'plan_to_read', 'dropped', 're_reading', 'completed'] as const;
            type ValidStatus = typeof validStatuses[number];

            const libraries: TLibraryItem[] = Object.entries(data).map(([mangaId, status]) => {
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
            return rejectWithValue('Failed to load favorites');
        }
    }
);

export const removeFromLibrary = createAsyncThunk<
    void,
    { mangaId: string; sessionToken: string },
    { rejectValue: string }
>('libraries/removeFromLibrary', async ({ mangaId, sessionToken }, { rejectWithValue }) => {
    try {
        await axios.put(
            `${BASE_URL}/manga/${mangaId}/status`,
            { status: null },
            {
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                },
            }
        );
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to remove from library");
    }
});


const initialState: TLibrary = {
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
                state.error = action.payload ?? 'Unknown error';
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
                state.error = payload || 'An error occurred';
            })

            .addCase(removeFromLibrary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromLibrary.fulfilled, (state, action) => {
                state.loading = false;
                const mangaId = action.meta.arg.mangaId;
                state.libraries = state.libraries.filter(item => item.mangaId !== mangaId);
            })
            .addCase(removeFromLibrary.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload || 'An error occurred';
            })

    },
});

const { actions, reducer } = librariesSlice;
export const {  } = actions;
export default reducer;
