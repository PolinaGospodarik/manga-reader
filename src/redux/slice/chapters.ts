import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/redux/store/store";
import {TChapter, TChaptersState} from "@/types/types"

const BASE_URL = 'https://manga-proxy-chi.vercel.app/proxy';

const initialState: TChaptersState = {
    chapters: [],
    loading: false,
    error: null,

    chapterImages: [],
    imagesLoading: false,
    imagesError: null,
};

export const fetchMangaChapters = createAsyncThunk<
    TChapter[],
    { mangaId: string; languages: string[] },
    { state: RootState }
>(
    'chapters/fetchMangaChapters',
    async ({ mangaId, languages }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/manga/${mangaId}/feed`, {
                params: {
                    translatedLanguage: languages,
                    order: { chapter: 'asc' },
                    limit: 500,
                },
            });

            const allChapters = response.data.data;
            const uniqueChaptersMap = new Map<string, TChapter>();

            for (const chapter of allChapters) {
                const chapterNumber = chapter.attributes.chapter;

                if (!chapterNumber) continue;

                if (!uniqueChaptersMap.has(chapterNumber)) {
                    uniqueChaptersMap.set(chapterNumber, {
                        id: chapter.id,
                        chapter: chapter.attributes.chapter,
                        title: chapter.attributes.title,
                        volume: chapter.attributes.volume,
                    });
                }
            }

            return Array.from(uniqueChaptersMap.values());
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch chapters");
        }
    }
);

export const fetchChapterImages = createAsyncThunk<
    string[],
    { chapterId: string; quality?: 'data' | 'data-saver' },
    { rejectValue: string }
>(
    'chapters/fetchChapterImages',
    async ({ chapterId, quality = 'data' }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
            const { baseUrl, chapter } = res.data;

            const hash = chapter.hash;
            const pages = quality === 'data-saver' ? chapter.dataSaver : chapter.data;

            const imageUrls = pages.map((file: string) => `${baseUrl}/${quality}/${hash}/${file}`);

            return imageUrls;
        } catch (err: any) {
            return rejectWithValue(err.message || 'Failed to load chapter images');
        }
    }
);

const chaptersSlice = createSlice({
    name: "chapters",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMangaChapters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMangaChapters.fulfilled, (state, action) => {
                state.loading = false;
                state.chapters = action.payload;
            })
            .addCase(fetchMangaChapters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchChapterImages.pending, (state) => {
                state.imagesLoading = true;
                state.imagesError = null;
                state.chapterImages = [];
            })
            .addCase(fetchChapterImages.fulfilled, (state, action) => {
                state.imagesLoading = false;
                state.chapterImages = action.payload;
            })
            .addCase(fetchChapterImages.rejected, (state, action) => {
                state.imagesLoading = false;
                state.imagesError = action.payload || 'Error loading images';
            });
    },
});

export const {  } = chaptersSlice.actions;
export default chaptersSlice.reducer;
