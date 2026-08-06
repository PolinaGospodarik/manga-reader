import React, {useContext, useEffect, useState} from 'react';
import styles from "./MangaPopularSlide.module.css"
import {TManga} from "@/types/types";
import TagList from "../TagList/TagList";

import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "@/hooks";
import {fetchMangaId} from "@/redux/slice/manga";
import {themeContext} from "@/roviders/ThemeContext";
import {fetchImage, getIndexes, getProxedImgaes} from "@/utils/useCoverUrls";


const MangaPopularSlide = ({manga}:{manga: TManga, index: number}) => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [color] = useContext(themeContext);
    const [imageSrc, setImageSrc] = useState(null);
    const [background, setBackgroundeSrc] = useState(null);

    const loading = useAppSelector(state => state.manga.loading);
    const error = useAppSelector(state => state.manga.error);


    const [coverUrl, backgroundUrl] = getProxedImgaes(manga);
    const [authorIndex, artistIndex] = getIndexes(manga);

    useEffect(() => {
        fetchImage(String(coverUrl)).then(res=> setImageSrc(res));
        fetchImage(String(backgroundUrl)).then(res=> setBackgroundeSrc(res));
    }, [coverUrl, backgroundUrl]);

    const handleClick = () => {
        dispatch(fetchMangaId(manga.id));
        navigate(`/manga/${manga.id}`);
    }

    return (
        <>
            <div className={`${styles["slide-popular"]} background-${color}`}  style={{ backgroundImage: `url(${background})` }} >
                <div className="container">
                    <div className={`${styles["popular-title"]} text-${color}`}>Popular New Titles</div>
                    <div className={`${styles["slide-popular-wrapper"]}`}>
                        <a className={`${styles["slide-popular-left__img"]}`} onClick={handleClick}>
                            {loading ? (
                                <div className="spinner-container spinner-container__img">
                                    <span className="loader"></span>
                                </div>
                            ) : error ? (
                                <p>Cover not available</p>
                            ) : imageSrc ? (
                                <img src={imageSrc} alt={manga.attributes?.title?.en || "Cover"} />
                            ) : (
                                <p>Cover not available</p>
                            )}
                        </a>
                        <div className={`${styles["slide-popular-right__text"]}`}>
                            <div className="text-top" onClick={handleClick}>
                                <div className={`${styles["text-top__title"]} text-${color}`}>
                                    <h2>{manga.attributes.title.en ||
                                        manga.attributes.title['ja-ro'] ||
                                        (Object.values(manga.attributes.title)[0] as string || '') ||
                                        'Title not available'}</h2>
                                </div>
                                <TagList tags={manga.attributes.tags}/>
                                <div className={`${styles["text-top__description"]} text-${color} scroll-container`}>
                                    <p>{manga.attributes.description?.en || ''}</p>
                                </div>
                            </div>
                            <div className={`${styles["text-bottom"]}`}>
                                <div className="text-bottom__creators">
                                    {manga.relationships[authorIndex]?.attributes?.name && (
                                        <span className={`${styles["creators-author"]} text-${color}`}>
                                            {manga.relationships[authorIndex].attributes.name}
                                        </span>
                                    )}
                                    {manga.relationships[artistIndex]?.attributes?.name && (
                                        <span className={`${styles["creators-artist"]} text-${color}`}>
                                            {manga.relationships[authorIndex]?.attributes?.name ? ', ' : ''}
                                            {manga.relationships[artistIndex].attributes.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default MangaPopularSlide;