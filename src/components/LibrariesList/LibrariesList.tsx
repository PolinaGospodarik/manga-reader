import React, { useEffect, useState, useContext } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {fetchLibraries} from '@/redux/slice/libraries';
import { fetchMangaId } from '@/redux/slice/manga';
import { fetchImage, getProxedImgaes } from '@/utils/useCoverUrls';
import { themeContext } from '@/roviders/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faBookmark} from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import "./LibrariesList.css";
import {getTokensFromLocalStorage} from "@/utils/authUtils";
import {Link} from "react-router-dom";

type LibrariesListType = {
    status: string;
    user?: boolean;
};

const LibrariesList: React.FC<LibrariesListType> = ({ status, user }) => {
    const dispatch = useAppDispatch();
    const [color] = useContext(themeContext);
    const { libraries, loading } = useAppSelector(state => state.libraries);

    const [filteredManga, setFilteredManga] = useState<any[]>([]);
    const [imagesMap, setImagesMap] = useState<Record<string, string>>({});
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        if (user) {
            dispatch(fetchLibraries(status));
        }
    }, [dispatch, user, status]);

    useEffect(() => {
        const filtered = libraries.filter(lib => lib.status === status);
        const fetchDetails = async () => {
            setLoadingDetails(true);
            try {
                const details = await Promise.all(
                    filtered.map(async (fav) => {
                        const result = await dispatch(fetchMangaId(fav.mangaId));
                        if (fetchMangaId.fulfilled.match(result)) {
                            return { ...result.payload, status: fav.status };
                        }
                        return null;
                    })
                );
                setFilteredManga(details.filter(Boolean));
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingDetails(false);
            }
        };
        fetchDetails();
    }, [status, libraries, dispatch]);

    // const handleRemove = (mangaId: string) => {
    //     const { accessToken } = getTokensFromLocalStorage();
    //     if (!accessToken) return;
    //
    //     dispatch(removeFromLibrary({ mangaId, sessionToken: accessToken }));
    // };
    useEffect(() => {
        filteredManga.forEach(manga => {
            const [coverUrl] = getProxedImgaes(manga.data);
            if (coverUrl && !imagesMap[manga.data.id]) {
                fetchImage(coverUrl).then(img => {
                    setImagesMap(prev => ({ ...prev, [manga.data.id]: img }));
                });
            }
        });
    }, [filteredManga]);


    return (
        <div className={`libraries__wrapper background-${color}`}>
            {loading || loadingDetails ? (
                <p className={`libraries__message text-${color}`}>Loading...</p>
            ) : !filteredManga.length ? (
                <p className={`libraries__message text-${color}`}>
                    No titles
                </p>
            ) : (
                <div className="libraries__grid">
                    {filteredManga.map(manga => (
                        <Link to={`/manga/${manga.data.id}`} key={manga.data.id} className={`libraries-item grey-${color}`}>
                            <div className="libraries-item__wrapper-img">
                                {imagesMap[manga.data.id] ? (
                                    <img
                                        className="libraries-item__img"
                                        src={imagesMap[manga.data.id]}
                                        alt={manga.data.attributes.title.en || 'Обложка'}
                                    />
                                ) : (
                                    <p>Обложка загружается...</p>
                                )}
                            </div>
                            <div className="libraries-item-info">
                                <div className="libraries-item-info__top">
                                    <h3 className={`libraries-item-info__title text-${color}`}>
                                        {manga.data.attributes.title.en || 'Без названия'}
                                    </h3>
                                    {/*<button*/}
                                    {/*    className="libraries-item__remove"*/}
                                    {/*    // onClick={() => handleRemove(manga.data.id)}*/}
                                    {/*    title="Remove from library"*/}
                                    {/*>*/}
                                    {/*    <FontAwesomeIcon className={`libraries-item__remove-icon text-${color}`} icon={faXmark} />*/}
                                    {/*</button>*/}
                                </div>
                                <div className="library-item__meta">
                                    <div className="library-item__stat">
                                        <FontAwesomeIcon className={`library-item__icon text-${color}`} icon={faStar} />
                                        <span className={`library-item__value text-${color}`}>
                                        {manga.rating?.average?.toFixed(2) || 'N/A'}
                                    </span>
                                    </div>
                                    <div className="library-item__stat">
                                        <FontAwesomeIcon className={`library-item__icon text-${color}`} icon={faBookmark} />
                                        <span className={`library-item__value text-${color}`}>
                                        {manga.follows || 0}
                                    </span>
                                    </div>
                                </div>
                                <p className={`libraries-item-info__description text-${color}`}>
                                    {manga.data.attributes.description?.en || ''}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LibrariesList;
