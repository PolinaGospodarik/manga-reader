import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, {AxiosResponse} from 'axios';
import {Manga, MangaSearch, SearchState} from "../../types/types";

export const fetchMangaByTitle = createAsyncThunk<
    { mangas: Manga[], totalResults: number},
    { title: string, offset: number },
    { rejectValue: string }
>(
    "manga/fetchMangaByTitlePagination",
    async ({ title, offset },   { rejectWithValue }) => {
        try {
            const response: AxiosResponse<MangaSearch> = await axios.get(
                "https://manga-proxy-chi.vercel.app/proxy/manga",
                {
                    params: {
                        title: title,
                        limit: 10,
                        offset,
                        includes: ["cover_art", "author", "artist"],
                        contentRating: ["safe", "suggestive"],
                        order: { updatedAt: "desc" },
                    },
                }
            );
            const totalResults = response.data.total;
            return { mangas: response.data.data, totalResults };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || 'Неизвестная ошибка');
            }
            return rejectWithValue('Неизвестная ошибка');
        }
    }
);



const initialState: SearchState  = {
    searchResults: [] as Manga[],
    searchValue: "",
    pageSearchValue: "",
    currentOffset: 0,
    totalPages: 1,
    totalResults: 0,
    limit: 10,
    loading: false,
    error: null
} satisfies SearchState

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers:{
        setSearchValue: (state, {payload}) =>{
            state.searchValue = payload;
            // console.log(payload);
        },
        setPageSearchValue: (state, {payload}) =>{
            state.pageSearchValue = payload;
            // console.log(payload);
        },
        clearSearch: (state) =>{
            state.searchValue = "";
            state.searchResults = [];
            state.error = null;
        },
        clearPageSearch: (state) =>{
            state.pageSearchValue = "";
            state.searchResults = [];
            state.error = null;
        },
        setCurrentOffset: (state, { payload }) => {
            state.currentOffset = payload;
        },

    },
    extraReducers:  (builder) =>{
        builder
            .addCase(fetchMangaByTitle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMangaByTitle.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.searchResults = payload.mangas;
                state.totalResults = payload.totalResults;
                state.totalPages = Math.ceil(payload.totalResults / state.limit);
            })
            .addCase(fetchMangaByTitle.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload || "Ошибка при поиске манги";
            });
    }
})

const { actions, reducer } = searchSlice;

export const { setSearchValue, clearSearch, setCurrentOffset, setPageSearchValue,clearPageSearch  } = actions;
export default reducer;