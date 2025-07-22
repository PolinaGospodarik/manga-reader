import React, {useContext, useEffect} from 'react';
import "./MangaList.css";
import MangaListItem from "../MangaListItem/MangaListItem";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchMangaLatest } from "@/redux/slice/manga";
import { TManga } from "@/types/types";
import {themeContext} from "@/roviders/ThemeContext";

const MangaList = () => {
    const dispatch = useAppDispatch();
    const [color] = useContext(themeContext);

    const mangaLatest = useAppSelector((state) => state.manga.mangaLatest);

    useEffect(() => {
        dispatch(fetchMangaLatest());
    }, [dispatch]);

    return (
        <div className="manga-latest">
            <div className="container">
                <div className={`manga-latest__title text-${color}`}><h2>Latest Updates</h2></div>
                <div className="manga-latest-wrapper">
                    {mangaLatest && mangaLatest.length > 0 ? (
                        mangaLatest.map((manga: TManga) => (
                            <MangaListItem key={manga.id} manga={manga} />
                        ))
                    ) : (
                        <div>No manga available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MangaList;
