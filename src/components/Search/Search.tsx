import React, {useContext} from 'react';
import styles from "./Search.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
    clearSearch,
    fetchMangaByTitle,
    setSearchValue,
    setCurrentOffset,
    setPageSearchValue, clearPageSearch
} from "@/redux/slice/search";
import {useNavigate} from "react-router-dom";
import {themeContext} from "@/roviders/ThemeContext";

const Search = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const searchPageValue = useAppSelector((state: any) => state.search.pageSearchValue);
    const [color] = useContext(themeContext);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchPageValue = event.target.value;
        dispatch(setPageSearchValue(searchPageValue));
        if (searchPageValue.trim()) {
            dispatch(setCurrentOffset(0));
            dispatch(fetchMangaByTitle({ title: searchPageValue, offset: 0 }));
            navigate(`?q=${encodeURIComponent(searchPageValue)}`);
        } else {
            dispatch(clearSearch());
        }
    };

    const handleClearSearch = () => {
        dispatch(setSearchValue(''));
        dispatch(clearPageSearch());
    };

    return (
        <div className={`${styles["search-page__input-wrapper"]}`}>
            <input
                type="search"
                placeholder="Search"
                className={`${styles["search-page__input"]} grey-${color} text-${color} placeholder-${color}`}
                value={searchPageValue}
                onChange={handleSearchChange}
            />
            {searchPageValue && (
                <button
                    type="button"
                    className={`${styles["search-page__button"]}`}
                    onClick={handleClearSearch}
                >
                    <FontAwesomeIcon className={`text-${color}`} icon={faTimes} />
                </button>
            )}
            {!searchPageValue && (
                <button type="button" className={`${styles["search-page__button"]}`}>
                    <FontAwesomeIcon className={`text-${color}`} icon={faMagnifyingGlass} />
                </button>
            )}
        </div>
    );
};

export default Search;
