import React, { useContext, useEffect, useState, useCallback } from "react";
import "./ChapterPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchChapterImages } from "@/redux/slice/chapters";
import { themeContext } from "@/roviders/ThemeContext";


const ChapterPage = () => {
    const { chapterId } = useParams<{ chapterId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [color] = useContext(themeContext);

    const images = useAppSelector(state => state.chapters.chapterImages);
    const loading = useAppSelector(state => state.chapters.imagesLoading);
    const error = useAppSelector(state => state.chapters.imagesError);
    const chapters = useAppSelector(state => state.chapters.chapters);

    const [currentPage, setCurrentPage] = useState(0);

    const currentChapterIndex = chapters.findIndex(ch => ch.id === chapterId);
    const hasNextChapter = currentChapterIndex < chapters.length - 1;
    const hasPrevChapter = currentChapterIndex > 0;

    useEffect(() => {
        if (chapterId) {
            dispatch(fetchChapterImages({ chapterId }));
        }
    }, [chapterId, dispatch]);

    useEffect(() => {
        setCurrentPage(0);
    }, [images]);

    const nextPage = useCallback(() => {
        if (currentPage < images.length - 1) {
            setCurrentPage(prev => prev + 1);
        } else if (hasNextChapter) {
            const nextChapterId = chapters[currentChapterIndex + 1].id;
            navigate(`/chapter/${nextChapterId}`);
        }
    }, [currentPage, images.length, hasNextChapter, chapters, currentChapterIndex, navigate]);

    const prevPage = useCallback(() => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        } else if (hasPrevChapter) {
            const prevChapterId = chapters[currentChapterIndex - 1].id;
            navigate(`/chapter/${prevChapterId}`);
        }
    }, [currentPage, hasPrevChapter, chapters, currentChapterIndex, navigate]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") nextPage();
            if (e.key === "ArrowLeft") prevPage();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [nextPage, prevPage]);

    if (loading) return (
        <div className="spinner-container spinner-container__img">
            <span className="loader"></span>
        </div>
    );

    if (error) return <p>Error loading page: {error}</p>;

    return (
        <div className={`chapter background-${color}`}>
            <div className="container">
                <div className="chapter__navigation">
                    <button className={`chapter__navigation-item chapter__button grey-${color} text-${color}`} onClick={prevPage} disabled={!hasPrevChapter && currentPage === 0}>Previous</button>
                    <span className={`chapter__navigation-item chapter__navigation-info grey-${color} text-${color}`}>Page {currentPage + 1} / {images.length}</span>
                    <button className={`chapter__navigation-item chapter__button grey-${color} text-${color}`} onClick={nextPage} disabled={!hasNextChapter && currentPage === images.length - 1}>Next</button>
                </div>

                <div className="chapter__wrapper">
                    {images.length > 0 && (
                        <img
                            className="chapter__img"
                            src={images[currentPage]}
                            alt={`Page ${currentPage + 1}`}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChapterPage;
