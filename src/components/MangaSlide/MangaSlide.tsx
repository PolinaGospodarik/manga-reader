    import React, {useContext, useEffect, useState} from 'react';
    import "./MangaSlide.css"
    import {Manga, Relationship} from "@/types/types";
    import {useAppDispatch} from "@/hooks";
    import {fetchMangaId} from "@/redux/slice/manga";
    import {useNavigate} from "react-router-dom";
    import {themeContext} from "@/roviders/ThemeContext";
    import {fetchImage, getIndexes, getProxedImgaes} from "@/utils/useCoverUrls";

    const MangaSlide = ({manga, index}:{manga: Manga, index: number}) => {

        const dispatch = useAppDispatch();
        const navigate = useNavigate();
        const [color] = useContext(themeContext);

        const [imageSrc, setImageSrc] = useState(null);

        const [coverUrl] = getProxedImgaes(manga);

        useEffect(() => {
            fetchImage(String(coverUrl)).then(res=> setImageSrc(res));
        }, [coverUrl]);

        const handleClick = () => {
            dispatch(fetchMangaId(manga.id));
            navigate(`/manga/${manga.id}`);
        }

        return (
            <>
                <div className="slide" onClick={handleClick}>
                    <div className="slide-wrapper">
                        <div className="slide__img">
                            {imageSrc ? (
                                <img src={String(imageSrc)} alt={manga.attributes?.title?.en || 'Cover'}/>
                            ) : (
                                <p>Обложка не доступна</p>
                            )}
                            <div className="text__description scroll-container">
                                <h3>{manga.attributes.description?.en || ''}</h3>
                            </div>
                            <button className="slide-read">Read</button>
                        </div>
                        <div className="slide__text">
                            <div className={`text__title text-${color}`}>
                                <h3>{manga.attributes.title?.en || ''}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    export default MangaSlide;