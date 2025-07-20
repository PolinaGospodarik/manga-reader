import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import {Manga, MangaApiResponse, MangaState, MangaStatisticsResponse} from "../../types/types";


export const fetchMangaPopular = createAsyncThunk<Manga[], void, { rejectValue: string} >(
    "manga/fetchMangaPopular",
    async (_, { rejectWithValue }) =>{
        try{
            const response = await axios.get("https://manga-proxy-chi.vercel.app/proxy/manga", {
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
                return rejectWithValue(error.response?.data.message || 'Неизвестная ошибка');
            }
            return rejectWithValue('Неизвестная ошибка');
        }
    }
)

export const fetchMangaLatest = createAsyncThunk<Manga[], void, { rejectValue: string} >(
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
                return rejectWithValue(error.response?.data.message || 'Неизвестная ошибка');
            }
            return rejectWithValue('Неизвестная ошибка');
        }
    }
)

export const fetchMangaId = createAsyncThunk<MangaApiResponse, string, { rejectValue: string }>(
    "manga/fetchMangaId",
    async (mangaId: any, { rejectWithValue }) => {
        try {

            const mangaResponse = await axios.get<MangaApiResponse>(`https://manga-proxy-chi.vercel.app/proxy/manga/${mangaId}`, {
                params: {
                    includes: ["cover_art", "author", "artist"],
                },
            });

            const statsResponse: AxiosResponse<MangaStatisticsResponse> = await axios.get(`https://manga-proxy-chi.vercel.app/proxy/statistics/manga/${mangaId}`);
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
                return rejectWithValue(error.response?.data.message || 'Неизвестная ошибка');
            }
            return rejectWithValue('Неизвестная ошибка');
        }
    }
);



const initialState : MangaState = {
    mangaPopular: [],
    mangaLatest: [],
    mangaItem: null,
    loading: false,
    error: null
} satisfies MangaState

const mangaSlice = createSlice({
    name: 'manga',
    initialState,
    reducers:{},
    extraReducers:  (builder) =>{
        builder
            //популярная новая
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
                state.error = payload || 'Ошибка при загрузке манги';
            })
            //последняя обновлённая
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
                state.error = payload || 'Ошибка при загрузке манги';
            })
            //одна манга
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
                state.error = payload || 'Ошибка при загрузке манги';
            });

    }
})

const { actions, reducer } = mangaSlice;

export const {  } = actions;
export default reducer;