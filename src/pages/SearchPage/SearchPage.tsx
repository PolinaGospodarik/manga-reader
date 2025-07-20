import React, {useContext, useEffect} from 'react';
import "./SearchPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {fetchMangaByTitle, setCurrentOffset} from "../../redux/slice/search";
import { Manga, Relationship } from "../../types/types";
import { fetchMangaId } from "../../redux/slice/manga";
import Search from "../../components/Search/Search";
import Pagination from "../../components/Pagination/Pagination";
import {themeContext} from "../../roviders/ThemeContext";
import TagList from "@/components/TagList/TagList";

const SearchPage = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [color] = useContext(themeContext);

    const searchValue = new URLSearchParams(location.search).get('q') || '';
    const pageSearchValue = useAppSelector((state) => state.search.pageSearchValue);
    const searchResults = useAppSelector((state) => state.search.searchResults);
    const currentOffset = useAppSelector((state) => state.search.currentOffset);
    const totalResults = useAppSelector((state) => state.search.totalResults);
    const limit = useAppSelector((state) => state.search.limit);


    useEffect(() => {
        if (searchValue) {
            dispatch(fetchMangaByTitle({ title: searchValue, offset: currentOffset }));
        }
    }, [searchValue, currentOffset, dispatch]);

    const handleClick = (manga: Manga) => {
        dispatch(fetchMangaId(manga.id));
        navigate(`/manga/${manga.id}`);
    };

    const handlePrev = () => {
        if (currentOffset > 0) {
            dispatch(setCurrentOffset(currentOffset - limit));
        }
    };

    const handleNext = () => {
        if (currentOffset + limit < totalResults) {
            dispatch(setCurrentOffset(currentOffset + limit));
        }
    };


    return (
        <>
            <div className={`search-page background-${color}`}>
                <div className="container">
                    <Search />
                    <div className={`search-page-info text-${color}`}>
                        <h2>Search Results for "{pageSearchValue}"</h2>
                    </div>
                    {searchResults && searchResults.length > 0 ? (
                        <>
                            {searchResults.map((manga) => {
                                const coverArtIndex = manga.relationships.findIndex(
                                    (relationship: Relationship) => relationship.type === 'cover_art'
                                );
                                const cover = manga.relationships?.[coverArtIndex]?.attributes;
                                const fileName = cover?.fileName;
                                const coverUrl = fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg` : null;

                                return (
                                    <div className={`search-page__item grey-${color}`} key={manga.id} onClick={() => handleClick(manga)}>
                                        <div className="search-page__img">
                                            {coverUrl && <img src={coverUrl} alt="Cover" />}
                                        </div>
                                        <div  className="search-page__text">
                                            <div className={`search-page__title text-${color}`}>
                                                <h3>{manga.attributes.title?.en}</h3>
                                            </div>
                                            <TagList className="search-page__tag" tags={manga.attributes.tags}/>
                                            <div className={`search-field__item-description text-${color}`}>
                                                <p>{manga?.attributes?.description.en}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {totalResults > limit && (
                                <Pagination
                                    limit={limit}
                                    onPrev={handlePrev}
                                    onNext={handleNext}
                                    currentOffset={currentOffset}
                                />
                            )}
                        </>
                    ) : (
                        <div className={`search-page__no-results text-${color}`}>
                            <h3>Nothing found</h3>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SearchPage;
