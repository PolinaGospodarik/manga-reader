import React, {useContext, useEffect, useState} from 'react';
import "./MangaPopularSlide.css"
import {Manga} from "@/types/types";
import TagList from "../TagList/TagList";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "@/hooks";
import {fetchMangaId} from "@/redux/slice/manga";
import {themeContext} from "@/roviders/ThemeContext";
import {fetchImage, getIndexes, getProxedImgaes} from "@/utils/useCoverUrls";


const MangaPopularSlide = ({manga, index}:{manga: Manga, index: number}) => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [color] = useContext(themeContext);
    const [imageSrc, setImageSrc] = useState(null);
    const [background, setBackgroundeSrc] = useState(null);

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
            <div className={`slide-popular background-${color}`}  style={{ backgroundImage: `url(${background})` }} >
                <div className="container">
                    <div className={`popular-title text-${color}`}>Popular New Titles</div>
                    <div className="slide-popular-wrapper" >
                        <a className="slide-popular-left__img" onClick={handleClick}>
                            {imageSrc ? (
                                <img src={String(imageSrc)} alt={manga.attributes?.title?.en || 'Cover'}/>
                            ) : (
                                <p>Обложка не доступна</p>
                            )}
                        </a>
                        <div className="slide-popular-right__text">
                            <div className="text-top" onClick={handleClick}>
                                <div className={`text-top__title text-${color}`}>
                                    <h2>{manga.attributes.title?.en || ''}</h2>
                                </div>
                                <TagList tags={manga.attributes.tags}/>
                                <div className={`text-top__description text-${color} scroll-container`}>
                                    <p>{manga.attributes.description?.en || ''}</p>
                                </div>
                            </div>
                            <div className="text-bottom">
                                <div className="text-bottom__creators">
                                    {manga.relationships[authorIndex]?.attributes?.name && (
                                        <span className={`creators-author text-${color}`}>
                                            {manga.relationships[authorIndex].attributes.name}
                                        </span>
                                    )}
                                    {manga.relationships[artistIndex]?.attributes?.name && (
                                        <span className={`creators-artist text-${color}`}>
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