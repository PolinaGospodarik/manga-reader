import { configureStore } from '@reduxjs/toolkit';
import usersReducer from "../slice/users"
import mangaReducer from "../slice/manga"
import listReducer from "../slice/list"
import searchReducer from "../slice/search"
import librariesReducer from "../slice/libraries"
import chaptersReducer from "../slice/chapters"

const rootReducer ={
    users: usersReducer,
    manga: mangaReducer,
    list: listReducer,
    search: searchReducer,
    libraries: librariesReducer,
    chapters: chaptersReducer
}

const store = configureStore({
    reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store