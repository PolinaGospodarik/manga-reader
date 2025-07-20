import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/redux/store/store";

type Chapter = {
    id: string;
    chapter: string | null;
    title: string | null;
    volume: string | null;
};

type ChaptersState = {
    chapters: Chapter[];
    loading: boolean;
    error: string | null;

    // Для изображений выбранной главы:
    chapterImages: string[];
    imagesLoading: boolean;
    imagesError: string | null;
};

const initialState: ChaptersState = {
    chapters: [],
    loading: false,
    error: null,

    chapterImages: [],
    imagesLoading: false,
    imagesError: null,
};

export const fetchMangaChapters = createAsyncThunk<
    Chapter[],
    { mangaId: string; languages: string[] },
    { state: RootState }
>(
    'chapters/fetchMangaChapters',
    async ({ mangaId, languages }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://manga-proxy-chi.vercel.app/proxy/manga/${mangaId}/feed`, {
                params: {
                    translatedLanguage: languages,
                    order: { chapter: 'asc' },
                    limit: 20,
                },
            });

            return response.data.data.map((chapter: any) => ({
                id: chapter.id,
                chapter: chapter.attributes.chapter,
                title: chapter.attributes.title,
                volume: chapter.attributes.volume,
            }));
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch chapters");
        }
    }
);

// Новый thunk для загрузки изображений главы
export const fetchChapterImages = createAsyncThunk<
    string[], // массив url изображений
    { chapterId: string; quality?: 'data' | 'data-saver' },
    { rejectValue: string }
>(
    'chapters/fetchChapterImages',
    async ({ chapterId, quality = 'data' }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`https://manga-proxy-chi.vercel.app/proxy/at-home/server/${chapterId}`);
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
        clearChapterImages(state) {
            state.chapterImages = [];
            state.imagesError = null;
            state.imagesLoading = false;
        }
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

            // Загрузка изображений главы
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

export const { clearChapterImages } = chaptersSlice.actions;
export default chaptersSlice.reducer;
