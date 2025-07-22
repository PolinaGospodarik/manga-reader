import React, {useEffect} from 'react';
import './App.css';
import {Provider} from "react-redux";
import store from "./redux/store/store"
import Header from "./components/Header/Header";
import "../src/utils/axiosInterceptor"
import LoginPage from "./pages/LoginPage/LoginPage";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import SearchPage from "./pages/SearchPage/SearchPage";
import ThemeContext from "./roviders/ThemeContext";
import LibrariesPage from "@/pages/LibrariesPage/LibrariesPage";
import {useAppDispatch} from "@/hooks";
import {initializeUser} from "@/redux/slice/users";
import ChapterPage from "@/pages/ChapterPage/ChapterPage";
import MangaPage from "@/pages/MangaPage/MangaPage";
import Footer from "@/components/Footer/Footer";

const AppContent = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const isLoginPage = location.pathname === "/login";

    useEffect(() => {
        dispatch(initializeUser());
    }, [dispatch]);

    return (
        <>
            {!isLoginPage && <Header/>}
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/manga/:id" element={<MangaPage/>} />
                <Route path="/search" element={<SearchPage/>} />
                <Route path="/favorites" element={<LibrariesPage/>} />
                <Route path="/chapter/:chapterId" element={<ChapterPage/>} />
            </Routes>
            {!isLoginPage && <Footer/>}
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ThemeContext>
                <Provider store={store}>
                    <AppContent />
                </Provider>
            </ThemeContext>
        </BrowserRouter>
    );
}

export default App;
