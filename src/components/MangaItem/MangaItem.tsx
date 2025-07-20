import React, { useContext, useEffect, useState } from 'react';
import "./MangaItem.css";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {Link, useParams} from "react-router-dom";
import { fetchMangaId } from "@/redux/slice/manga";
import { themeContext } from "@/roviders/ThemeContext";
import { fetchImage, getIndexes, getProxedImgaes } from "@/utils/useCoverUrls";
import { addToLibrary } from "@/redux/slice/libraries";
import LibraryModal from "@/components/LibraryModal/LibraryModal";
import AccentButton from "@/components/AccentButton/AccentButton";
import { getTokensFromLocalStorage } from "@/utils/authUtils";
import { fetchMangaChapters } from "@/redux/slice/chapters"; // ⬅️ Импортируем

const MangaItem = () => {
    const { id } = useParams();
    const [color] = useContext(themeContext);
    const [showModal, setShowModal] = useState(false);

    const dispatch = useAppDispatch();

    const mangaItem = useAppSelector(state => state.manga.mangaItem);
    const loading = useAppSelector(state => state.manga.loading);
    const error = useAppSelector(state => state.manga.error);
    const user = useAppSelector(state => state.users.user);

    const chapters = useAppSelector(state => state.chapters.chapters);
    const chaptersLoading = useAppSelector(state => state.chapters.loading);
    const chaptersError = useAppSelector(state => state.chapters.error);

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [backgroundSrc, setBackgroundSrc] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchMangaId(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (mangaItem?.data) {
            const [coverUrl, backgroundUrl] = getProxedImgaes({ ...mangaItem.data, id });

            if (coverUrl) {
                fetchImage(coverUrl).then(res => setImageSrc(res));
            }
            if (backgroundUrl) {
                fetchImage(backgroundUrl).then(res => setBackgroundSrc(res));
            }

            // Загружаем главы
            dispatch(fetchMangaChapters({ mangaId: id!, languages: ['en'] }));
        }
    }, [mangaItem, id, dispatch]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;
    if (!mangaItem) return <p>Данные не найдены</p>;

    const { data, rating, follows } = mangaItem;
    const [authorIndex, artistIndex] = getIndexes(data);

    return (
        <div className={`manga-id background-${color}`}>
            <div className="manga-id-background" style={{ backgroundImage: `url(${backgroundSrc})` }}>
                <div className="manga-id-overlay"></div>
            </div>
            <div className="container">
                <div className="manga-id-wrapper">
                    <div className="manga-id__img">
                        {imageSrc ? (
                            <img src={imageSrc} alt={data?.attributes?.title?.en || 'Cover'} />
                        ) : (
                            <p>Обложка не доступна</p>
                        )}
                    </div>
                    <div className="manga-id__content">
                        <div className="manga-id__content-top">
                            <div className={`manga-id__title text-${color}`}>
                                <h1>{data?.attributes?.title?.en}</h1>
                            </div>
                            <div className="manga-id__creators">
                                {data.relationships[authorIndex]?.attributes?.name && (
                                    <span className={`creators-author text-${color}`}>
                                        {data.relationships[authorIndex].attributes.name}
                                    </span>
                                )}
                                {data.relationships[artistIndex]?.attributes?.name && (
                                    <span className={`creators-artist text-${color}`}>
                                        {data.relationships[authorIndex]?.attributes?.name ? ', ' : ''}
                                        {data.relationships[artistIndex].attributes.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="manga-id__content-bottom">
                            {user ? (
                                <>
                                    <AccentButton className="manga-id__button" onClick={() => setShowModal(true)}>
                                        Add To Library
                                    </AccentButton>

                                    {showModal && (
                                        <LibraryModal
                                            imageSrc={imageSrc}
                                            title={data?.attributes?.title?.en || 'No title'}
                                            onConfirm={(status) => {
                                                if (!id) return;

                                                const { accessToken } = getTokensFromLocalStorage();
                                                if (!accessToken) {
                                                    alert('Ошибка: токен не найден');
                                                    return;
                                                }

                                                dispatch(addToLibrary({
                                                    mangaId: id,
                                                    sessionToken: accessToken,
                                                    status: status as "reading" | "on_hold" | "plan_to_read" | "dropped" | "re_reading" | "completed",
                                                }));

                                                setShowModal(false);
                                            }}
                                            onCancel={() => setShowModal(false)}
                                        />
                                    )}
                                </>
                            ) : (
                                <p className={`text-${color}`}>Войдите, чтобы добавить мангу в избранное.</p>
                            )}

                            <div className={`manga-id__manga-stats text-${color}`}>
                                <p>Rating: {rating?.bayesian.toFixed(2)}</p>
                                <p>Number of subscriptions: {follows}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`manga-id__description text-${color}`}>
                    <p>{data?.attributes?.description?.en}</p>
                </div>

                <div className={`manga-id__chapters text-${color}`}>
                    <h2>Chapters:</h2>
                    {chaptersLoading ? (
                        <p>Загрузка глав...</p>
                    ) : chaptersError ? (
                        <p>Ошибка загрузки глав: {chaptersError}</p>
                    ) : chapters.length === 0 ? (
                        <p>Нет доступных глав</p>
                    ) : (
                        <ul>
                            {chapters.map(ch => (
                                <li key={ch.id}>
                                    <Link to={`/chapter/${ch.id}`} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'inherit' }}>
                                        {ch.chapter ? `Chapter ${ch.chapter}` : "Chapter ?"}
                                        {ch.title ? ` - ${ch.title}` : ""}
                                        {ch.volume ? ` (Vol. ${ch.volume})` : ""}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MangaItem;
