import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {TListState, TMangaDetails, TRelationship} from "@/types/types";

const BASE_URL = 'https://manga-proxy-chi.vercel.app/proxy';

export const fetchMangaSelfPublished = createAsyncThunk<
    { listId: string, mangaData: TMangaDetails[], listName: string },
    { listId: string, contentRating: string[] },
    { rejectValue: string }
>(
    "list/fetchMangaSelfPublished",
    async ({ listId, contentRating }, { rejectWithValue }) => {
        try {
            const listResponse: { data: { data: { attributes: { name: string }; relationships: TRelationship[] } } } =
                await axios.get(`${BASE_URL}/list/${listId}`);

            const mangaIds: string[] = listResponse.data.data.relationships
                .filter((rel: TRelationship) => rel.type === "manga")
                .map((rel: TRelationship) => rel.id);

            const params = {
                ids: mangaIds,
                contentRating,
                includes: ["cover_art", "content_rating"],
                order: {
                    createdAt: "desc",
                    title: "asc",
                },
                hasAvailableChapters: true,
            };

            const mangaDetailsResponse: { data: { data: TMangaDetails[] } } =
                await axios.get(`${BASE_URL}/manga`, { params });

            const mangaData = mangaDetailsResponse.data.data;

            return {
                listId,
                mangaData,
                listName: listResponse.data.data.attributes.name,
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', error.response?.data);
                return rejectWithValue(error.response?.data.message || 'Unknown error');
            }
            console.error('Unknown error details:', error);
            return rejectWithValue('Unknown error');
            }
    }
);

const initialState: TListState = {
    mangaSelfPublished: {},
    loading: false,
    error: null
}

const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMangaSelfPublished.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMangaSelfPublished.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.mangaSelfPublished[payload.listId] = {
                    mangaData: payload.mangaData,
                    listName: payload.listName
                };
            })
            .addCase(fetchMangaSelfPublished.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload || 'Error loading manga';
            })
    }
})

const { actions, reducer } = listSlice;
export const {  } = actions;
export default reducer;
