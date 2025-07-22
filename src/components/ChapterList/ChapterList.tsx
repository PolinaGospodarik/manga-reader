import React from "react";
import "./ChapterList.css"
import { useAppSelector } from "@/hooks";
import { Link } from "react-router-dom";
import { themeContext } from "@/roviders/ThemeContext";
import { useContext } from "react";

const ChapterList = () => {
    const [color] = useContext(themeContext);
    const chapters = useAppSelector(state => state.chapters.chapters);
    const loading = useAppSelector(state => state.chapters.loading);
    const error = useAppSelector(state => state.chapters.error);

    return (
        <div className={`chapters text-${color}`}>
            <div className="container">
                <h2 className="chapters__title">Chapters:</h2>
                {loading ? (
                    <div className="spinner-container">
                        <span className="loader"></span>
                    </div>
                ) : error ? (
                    <p>Error loading chapters: {error}</p>
                ) : chapters.length === 0 ? (
                    <p>No chapters available</p>
                ) : (
                    <ul className="chapters__list">
                        {chapters.map(ch => (
                            <li className={`chapters__item`} key={ch.id}>
                                <Link className={`chapters__item-link text-${color} grey-${color}`} to={`/chapter/${ch.id}`}>
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
    );
};

export default ChapterList;
