import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import {TManga, TMangaApiResponse, TMangaState, TMangaStatisticsResponse} from "@/types/types";

const BASE_URL = 'https://manga-proxy-chi.vercel.app/proxy';

export const fetchMangaPopular = createAsyncThunk<TManga[], void, { rejectValue: string} >(
    "manga/fetchMangaPopular",
    async (_, { rejectWithValue }) =>{
        try{
            const response = await axios.get(`${BASE_URL}/manga`, {
                params: {
                    limit: 10,
                    order: {
                        createdAt: "desc",
                        followedCount: "desc",
                    },
                    contentRating: ["safe", "suggestive"],
                    includes: ["cover_art", "author", "artist"],
                },
            });
            return response.data.data;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || 'Unknown error');
            }
            return rejectWithValue('Unknown error');
        }
    }
)

export const fetchMangaLatest = createAsyncThunk<TManga[], void, { rejectValue: string} >(
    "manga/fetchMangaLatest",
    async (_, { rejectWithValue }) =>{
        try{
            const response = await axios.get(
                "https://manga-proxy-chi.vercel.app/proxy/manga",
                {
                    params: {
                        limit: 10,
                        order: { updatedAt: "desc" },
                        includes: ["cover_art", "author", "artist"],
                        contentRating: ["safe", "suggestive"],
                    },
                }
            );
            return response.data.data;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || 'Unknown error');
            }
            return rejectWithValue('Unknown error');
        }
    }
)

export const fetchMangaId = createAsyncThunk<TMangaApiResponse, string, { rejectValue: string }>(
    "manga/fetchMangaId",
    async (mangaId: any, { rejectWithValue }) => {
        try {

            const mangaResponse = await axios.get<TMangaApiResponse>(`${BASE_URL}/manga/${mangaId}`, {
                params: {
                    includes: ["cover_art", "author", "artist"],
                },
            });

            const statsResponse: AxiosResponse<TMangaStatisticsResponse> = await axios.get(`${BASE_URL}/statistics/manga/${mangaId}`);
            const stats = statsResponse.data.statistics[mangaId];

            return {
                ...mangaResponse.data,
                rating: {
                    average: stats.rating.average,
                    bayesian: stats.rating.bayesian,
                },
                follows:stats.follows,
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || 'Unknown error');
            }
            return rejectWithValue('Unknown error');
        }
    }
);



const initialState : TMangaState = {
    mangaPopular: [],
    mangaLatest: [],
    mangaItem: null,
    loading: false,
    error: null
} satisfies TMangaState

const mangaSlice = createSlice({
    name: 'manga',
    initialState,
    reducers:{},
    extraReducers:  (builder) =>{
        builder
            .addCase(fetchMangaPopular.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMangaPopular.fulfilled, (state, {payload})=>{
                state.loading = false;
                state.mangaPopular =payload

            })
            .addCase(fetchMangaPopular.rejected, (state, {payload})=>{
                state.loading = false;
                state.error = payload || 'Error loading manga';
            })

            .addCase(fetchMangaLatest.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMangaLatest.fulfilled, (state, {payload})=>{
                state.loading = false;
                state.mangaLatest =payload
            })
            .addCase(fetchMangaLatest.rejected, (state, {payload})=>{
                state.loading = false;
                state.error = payload || 'Error loading manga';
            })

            .addCase(fetchMangaId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMangaId.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.mangaItem= payload;
            })
            .addCase(fetchMangaId.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload || 'Error loading manga';
            });
    }
})

const { actions, reducer } = mangaSlice;

export const {  } = actions;
export default reducer;