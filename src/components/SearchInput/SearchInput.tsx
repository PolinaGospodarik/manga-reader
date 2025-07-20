import React, { useContext, useEffect, useState } from 'react';
import "./SearchInput.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
    clearSearch,
    fetchMangaByTitle,
    setPageSearchValue,
    setSearchValue
} from "../../redux/slice/search";
import { Manga } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { fetchMangaId } from "../../redux/slice/manga";
import { themeContext } from "../../roviders/ThemeContext";
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

    const handleClick = (manga: Manga) => {
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
        <div className="header-right__search">
            <input
                type="search"
                placeholder="Search"
                className={`search-input ${isFocused ? 'search--focused' : ''} grey-${color} text-${color} placeholder-${color}`}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
            />
            {isListVisible && searchResults?.length > 0 && isFocused && (
                <ul className={`search-field scroll-container background-${color}`}>
                    {searchResults.map(manga => {
                        const coverImg = imagesMap[manga.id];
                        return (
                            <li
                                className="search-field__item"
                                key={manga.id}
                                onMouseDown={() => handleClick(manga)}
                            >
                                <div className={`search-field__item-wrapper grey-${color} selection-${color}`}>
                                    <div className="search-field__item-img">
                                        {coverImg ? (
                                            <img src={coverImg} alt="Cover" />
                                        ) : (
                                            <p>Обложка не доступна</p>
                                        )}
                                    </div>
                                    <div className={`search-field__item-title text-${color}`}>
                                        <h4>{manga.attributes.title?.en}</h4>
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
                    className={`search-button text-${color}`}
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            ) : (
                <button type="button" className={`search-button text-${color}`} aria-label="Search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            )}
        </div>
    );
};

export default SearchInput;
