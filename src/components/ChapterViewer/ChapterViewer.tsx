import React, {useCallback, useContext, useEffect, useState} from "react";
import "./ChapterViewer.css";
import { useNavigate } from "react-router-dom";
import { TChapterViewer } from "@/types/types";
import { themeContext } from "@/roviders/ThemeContext";

const ChapterViewer: React.FC<TChapterViewer> = ({images, chapters, currentChapterIndex, hasNextChapter, hasPrevChapter}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const [color] = useContext(themeContext);

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

    useEffect(() => {
        setCurrentPage(0);
    }, [images]);

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, currentTarget } = e;
        const middle = currentTarget.offsetWidth / 2;

        if (clientX < middle) {
            if (currentPage === 0 && hasPrevChapter) {
                const prevChapterId = chapters[currentChapterIndex - 1].id;
                navigate(`/chapter/${prevChapterId}`);
            } else {
                prevPage();
            }
        } else {

            if (currentPage === images.length - 1 && hasNextChapter) {
                const nextChapterId = chapters[currentChapterIndex + 1].id;
                navigate(`/chapter/${nextChapterId}`);
            } else {
                nextPage();
            }
        }
    };

    return (
        <>
            <div className="chapter__navigation">
                <button
                    className={`chapter__navigation-item grey-${color} text-${color}`}
                    onClick={prevPage}
                    disabled={!hasPrevChapter && currentPage === 0}
                >
                    Previous
                </button>
                <span className={`chapter__navigation-item grey-${color} text-${color}`}>
                    Page {currentPage + 1} / {images.length}
                </span>
                <button
                    className={`chapter__navigation-item grey-${color} text-${color}`}
                    onClick={nextPage}
                    disabled={!hasNextChapter && currentPage === images.length - 1}
                >
                    Next
                </button>
            </div>

            <div className="chapter__wrapper" onClick={handleImageClick}>
                {images.length > 0 && (
                    <img
                        className="chapter__img"
                        src={images[currentPage]}
                        alt={`Page ${currentPage + 1}`}
                    />
                )}
            </div>
        </>
    );
};

export default ChapterViewer;
