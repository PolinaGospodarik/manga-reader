import React, {useContext, useEffect} from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchMangaId } from "@/redux/slice/manga";
import { fetchMangaChapters } from "@/redux/slice/chapters";
import MangaInfo from "@/components/MangaInfo/MangaInfo";
import ChapterList from "@/components/ChapterList/ChapterList";
import "./MangaPage.css"
import {themeContext} from "@/roviders/ThemeContext";

const MangaPage = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [color] = useContext(themeContext);

    const mangaItem = useAppSelector(state => state.manga.mangaItem);

    useEffect(() => {
        if (id) {
            dispatch(fetchMangaId(id));
            dispatch(fetchMangaChapters({ mangaId: id, languages: ['en'] }));
        }
    }, [id, dispatch]);

    if (!mangaItem) return (
        <div className={`spinner-fullscreen background-${color}`}>
            <div className="spinner-container spinner-container__img">
                <span className="loader"></span>
            </div>
        </div>
    );

    return (
        <div className={`manga-page background-${color}`}>
            <MangaInfo manga={mangaItem} />
            <ChapterList />
        </div>
    );
};

export default MangaPage;
