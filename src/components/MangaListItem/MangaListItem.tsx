import React, { useEffect, useState, useContext } from 'react';
import { Manga } from "@/types/types";
import { fetchImage, getIndexes, getProxedImgaes } from "@/utils/useCoverUrls";
import { themeContext } from "@/roviders/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { fetchMangaId } from "@/redux/slice/manga";
import "./MangaListItem.css";

const MangaListItem = ({ manga }: { manga: Manga }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [color] = useContext(themeContext);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [coverUrl] = getProxedImgaes(manga);
    const [coverArtIndex, authorIndex, artistIndex] = getIndexes(manga);

    useEffect(() => {
        if (coverUrl) {
            fetchImage(String(coverUrl)).then(res => setImageSrc(res));
        }
    }, [coverUrl]);

    const handleClick = () => {
        dispatch(fetchMangaId(manga.id));
        navigate(`/manga/${manga.id}`);
    };

    return (
        <div className={`manga-latest__item grey-${color}`} key={manga.id} onClick={handleClick}>
            <div className="item-left">
                <a className="item-left__img">
                    {imageSrc ? (
                        <img src={imageSrc} alt={manga.attributes?.title?.en || 'Cover'} />
                    ) : (
                        <p>Обложка не доступна</p>
                    )}
                </a>
            </div>
            <div className="item-right">
                <div className={`item__title text-${color}`}>
                    <h3>{manga.attributes.title?.en || 'Название недоступно'}</h3>
                </div>
                <span className={`item__title text-${color}`}>{manga.relationships[authorIndex]?.attributes?.name}</span>
                <span className={`item__title text-${color}`}>{manga.relationships[artistIndex]?.attributes?.name}</span>
            </div>
        </div>
    );
};

export default MangaListItem;
