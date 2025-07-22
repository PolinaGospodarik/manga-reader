    import React, {useContext, useEffect, useState} from 'react';
    import "./MangaSlide.css"
    import {TManga} from "@/types/types";
    import {useAppDispatch, useAppSelector} from "@/hooks";
    import {fetchMangaId} from "@/redux/slice/manga";
    import {useNavigate} from "react-router-dom";
    import {themeContext} from "@/roviders/ThemeContext";
    import {fetchImage, getProxedImgaes} from "@/utils/useCoverUrls";

    const MangaSlide = ({manga}:{manga: TManga, index: number}) => {

        const dispatch = useAppDispatch();
        const navigate = useNavigate();
        const [color] = useContext(themeContext);
        const [imageSrc, setImageSrc] = useState(null);
        const [coverUrl] = getProxedImgaes(manga);

        const loading = useAppSelector(state => state.manga.loading);
        const error = useAppSelector(state => state.manga.error);

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
                        {loading ? (
                            <div className="spinner-overlay">
                                <span className="loader"></span>
                            </div>
                        ) : (
                            <>
                                <div className="slide__img">
                                    {error ? (
                                        <p>Cover not available</p>
                                    ) : imageSrc ? (
                                        <img src={imageSrc} alt={manga.attributes?.title?.en || "Cover"} />
                                    ) : (
                                        <p>Cover not available</p>
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
                            </>
                        )}
                    </div>
                </div>
            </>
        );
    };

    export default MangaSlide;