import React, { useContext, useEffect, useState } from "react";
import styles from "./MangaInfo.module.css";
import LibraryModal from "@/components/LibraryModal/LibraryModal";
import Button from "../AccentButton/Button";
import { themeContext } from "@/roviders/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { getProxedImgaes, fetchImage, getIndexes } from "@/utils/useCoverUrls";
import { getTokensFromLocalStorage } from "@/utils/authUtils";
import { addToLibrary } from "@/redux/slice/libraries";
import {useNavigate} from "react-router-dom";
import {TMangaInfo} from "@/types/types"

const MangaInfo: React.FC<TMangaInfo> =({ manga }) => {
    const [color] = useContext(themeContext);
    const [imageError, setImageError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useAppSelector(state => state.users.user);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [backgroundSrc, setBackgroundSrc] = useState<string | null>(null);
    const id = manga?.data?.id;

    const [authorIndex, artistIndex] = getIndexes(manga.data);

    useEffect(() => {
        const [coverUrl, bgUrl] = getProxedImgaes({ ...manga.data, id });
        if (coverUrl) fetchImage(coverUrl).then(setImageSrc);
        if (bgUrl) fetchImage(bgUrl).then(setBackgroundSrc);
    }, [manga, id]);

    const { data, rating, follows } = manga;

    return (
        <div className={`${styles["manga-id"]} background-${color}`}>
            <div className={`${styles["manga-id-background"]}`} style={{ backgroundImage: `url(${backgroundSrc})` }}>
                <div className={`${styles["manga-id-overlay"]}`}></div>
            </div>
            <div className="container">
                <div className={`${styles["manga-id-wrapper"]}`}>
                    <div className={`${styles["manga-id__img"]}`}>
                        {imageSrc && !imageError ? (
                            <img
                                src={imageSrc}
                                alt={data?.attributes?.title?.en || "Cover"}
                                onError={() => setImageError(true)}
                            />
                        ) : imageError ? (
                            <p>Cover not available</p>
                        ) : (
                            <div className="spinner-container spinner-container__img">
                                <span className="loader"></span>
                            </div>
                        )}
                    </div>

                    <div className={`${styles["manga-id__content"]}`}>
                        <div className={`${styles["manga-id__content-top"]}`}>
                            <h1 className={`${styles["manga-id__title"]} text-${color}`}>{data?.attributes?.title?.en ||
                                data?.attributes?.title['ja-ro'] ||
                                (Object.values(data?.attributes?.title)[0] as string || '') ||
                                'Title not available'}</h1>
                            <div className="manga-id__creators">
                                {data.relationships[authorIndex]?.attributes?.name && (
                                    <span className={`creators-author text-${color}`}>
                    {data.relationships[authorIndex].attributes.name}
                  </span>
                                )}
                                {data.relationships[artistIndex]?.attributes?.name && (
                                    <span className={`creators-artist text-${color}`}>
                    {data.relationships[authorIndex]?.attributes?.name ? ", " : ""}
                                        {data.relationships[artistIndex].attributes.name}
                  </span>
                                )}
                            </div>
                        </div>
                        <div className={`${styles["manga-id__content-bottom"]}`}>
                            {user ? (
                                <>
                                    <Button variant="orange" className="manga-id__button" onClick={() => setShowModal(true)}>Add To Library</Button>
                                    {showModal && (
                                        <LibraryModal
                                            imageSrc={imageSrc}
                                            title={data?.attributes?.title?.en || "No title"}
                                            onConfirm={(status) => {
                                                const { accessToken } = getTokensFromLocalStorage();
                                                if (!accessToken || !id) return alert("Error: No token or id");
                                                dispatch(
                                                    addToLibrary({
                                                        mangaId: id,
                                                        sessionToken: accessToken,
                                                        status: status as "reading" | "on_hold" | "plan_to_read" | "dropped" | "re_reading" | "completed",
                                                    })
                                                );
                                                setShowModal(false);
                                            }}
                                            onCancel={() => setShowModal(false)}
                                        />
                                    )}
                                </>
                            ) : (
                                <div>
                                    <Button variant="orange" onClick={() => navigate("/login")}>Sign In</Button>
                                    <p className={`${styles["manga-id__text-info"]} text-${color}`}>Log in to add manga to your library</p>
                                </div>
                            )}
                            <div className={`${styles["manga-id__manga-stats"]} text-${color}`}>
                                <p>Rating: {rating?.bayesian.toFixed(2)}</p>
                                <p>Number of subscriptions: {follows}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles["manga-id__description"]} text-${color}`}>
                    <p>{data?.attributes?.description?.en}</p>
                </div>
            </div>
        </div>
    );
};

export default MangaInfo;
