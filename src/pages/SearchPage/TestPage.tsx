import React, {useContext, useEffect} from 'react';
import "./SearchPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {fetchMangaByTitle, setCurrentOffset} from "../../redux/slice/search";
import { Manga, Relationship } from "../../types/types";
import { fetchMangaId } from "../../redux/slice/manga";
import Search from "../../components/Search/Search";
import Pagination from "../../components/Pagination/Pagination";
import {themeContext} from "../../roviders/ThemeContext";
import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const TestPage = () => {
    // const location = useLocation();
    // const dispatch = useAppDispatch();
    // const navigate = useNavigate();
    // const [color] = useContext(themeContext);
    //
    // const searchValue = new URLSearchParams(location.search).get('q') || '';
    // const pageSearchValue = useAppSelector((state: any) => state.search.pageSearchValue);
    // const searchResults = useAppSelector((state) => state.search.searchResults);
    // const currentOffset = useAppSelector((state) => state.search.currentOffset);
    // const totalResults = useAppSelector((state) => state.search.totalResults);
    // const limit = useAppSelector((state) => state.search.limit);
    //
    //
    // useEffect(() => {
    //     if (searchValue) {
    //         dispatch(fetchMangaByTitle({ title: searchValue, offset: currentOffset }));
    //     }
    // }, [searchValue, currentOffset, dispatch]);
    //
    // const handleClick = (manga: Manga) => {
    //     dispatch(fetchMangaId(manga.id));
    //     navigate(`/manga/${manga.id}`);
    // };
    //
    // const handlePrev = () => {
    //     if (currentOffset > 0) {
    //         dispatch(setCurrentOffset(currentOffset - limit));
    //     }
    // };
    //
    // const handleNext = () => {
    //     if (currentOffset + limit < totalResults) {
    //         dispatch(setCurrentOffset(currentOffset + limit));
    //     }
    // };
    //
    // const fetchMangaPopular = createAsyncThunk<Manga[], void, { rejectValue: string} >(
    //     "manga/fetchMangaPopular",
    //     async (_, { rejectWithValue }) =>{
    //         try{
    //             const response = await axios.get("/api/manga", {
    //                 params: {
    //                     limit: 10,
    //                     order: {
    //                         createdAt: "desc",
    //                         followedCount: "desc",
    //                     },
    //                     contentRating: ["safe", "suggestive"],
    //                     includes: ["cover_art", "author", "artist"],
    //                 },
    //             });
    //             console.log(response.data.data);
    //             return response.data.data;
    //         }
    //         catch (error) {
    //             if (axios.isAxiosError(error)) {
    //                 return rejectWithValue(error.response?.data.message || 'Неизвестная ошибка');
    //             }
    //             return rejectWithValue('Неизвестная ошибка');
    //         }
    //     }
    // )
    //
    // const handleClick1 = () => {
    //     dispatch(fetchMangaPopular());
    // };
    //
    // return (
    //     <>
    //         <div className={`search-page background-${color}`}>
    //             <div className="container">
    //                 <button onClick={handleClick1}>fgdjiokjlsdgjkldg</button>
    //             </div>
    //         </div>
    //     </>
    // );
};

export default TestPage;
