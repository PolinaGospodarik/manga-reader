import React, { useContext, useEffect, useState } from 'react';
import styles from "./SearchInput.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
    clearSearch,
    fetchMangaByTitle,
    setPageSearchValue,
    setSearchValue
} from "@/redux/slice/search";
import { TManga } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { fetchMangaId } from "@/redux/slice/manga";
import { themeContext } from "@/roviders/ThemeContext";
import { fetchImage, getProxedImgaes } from "@/utils/useCoverUrls";

const SearchInput = () => {
    const [isListVisible, setIsListVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [color] = useContext(themeContext);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const searchValue = useAppSelector((state: any) => state.search.searchValue);
    const searchResults = useAppSelector(state => state.search.searchResults);

    const [imagesMap, setImagesMap] = useState<Record<string, string>>({});

    useEffect(() => {
        searchResults.forEach(manga => {
            const [coverUrl] = getProxedImgaes(manga);
            if (coverUrl && !imagesMap[manga.id]) {
                fetchImage(String(coverUrl)).then(imgSrc => {
                    setImagesMap(prev => ({ ...prev, [manga.id]: imgSrc }));
                });
            }
        });
    }, [searchResults, imagesMap]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        dispatch(setSearchValue(value));
        if (value.trim()) {
            dispatch(fetchMangaByTitle({ title: value, offset: 0 }));
            setIsListVisible(true);
        } else {
            dispatch(clearSearch());
            setIsListVisible(false);
        }
    };

    const handleFocus = () => setIsFocused(true);

    const handleBlur = () => {
        setIsFocused(false);
        setTimeout(() => setIsListVisible(false), 150);
    };

    const handleClick = (manga: TManga) => {
        dispatch(fetchMangaId(manga.id));
        navigate(`/manga/${manga.id}`);
        setIsListVisible(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            navigate(`/search?q=${searchValue}`);
            dispatch(setPageSearchValue(searchValue));
            dispatch(setSearchValue(''));
            setIsListVisible(false);
        }
    };

    const handleClearSearch = () => {
        dispatch(setSearchValue(''));
        setIsListVisible(false);
    };

    return (
        <div className={`${styles["header-right__search"]}`}>
            <input
                type="search"
                placeholder="Search"
                className={`${styles["search-input"]} ${isFocused ? `${styles["search--focused"]}` : ''} grey-${color} text-${color} placeholder-${color}`}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
            />


            {isListVisible && searchResults?.length > 0 && isFocused && (
                <ul className={`${styles["search-field"]} scroll-container background-${color}`}>
                    {searchResults.map(manga => {
                        const coverImg = imagesMap[manga.id];
                        return (
                            <li
                                className={`${styles["search-field__item"]}`}
                                key={manga.id}
                                onMouseDown={() => handleClick(manga)}
                            >
                                <div className={`${styles["search-field__item-wrapper"]} grey-${color} selection-${color}`}>
                                    <div className={`${styles["search-field__item-img"]}`}>
                                        {coverImg ? (
                                            <img src={coverImg} alt="Cover" />
                                        ) : (
                                            <div className="spinner-container spinner-container__img">
                                                <span className="loader"></span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={`${styles["search-field__item-title"]} text-${color}`}>
                                        <h4>{manga.attributes.title?.en||
                                            manga.attributes.altTitles?.en||
                                            manga.attributes.title['ja-ro'] ||
                                            (Object.values(manga.attributes.title)[0] as string || '') ||
                                            'Title not available'}
                                        </h4>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {searchValue ? (
                <button
                    type="button"
                    className={`${styles["search-button"]} text-${color}`}
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            ) : (
                <button type="button" className={`${styles["search-button"]} text-${color}`} aria-label="Search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            )}
        </div>
    );
};

export default SearchInput;
