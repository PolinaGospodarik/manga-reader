import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchChapterImages } from "@/redux/slice/chapters";
import { themeContext } from "@/roviders/ThemeContext";
import ChapterViewer from "@/components/ChapterViewer/ChapterViewer";
import "./ChapterPage.css";

const ChapterPage = () => {
    const { chapterId } = useParams<{ chapterId: string }>();
    const dispatch = useAppDispatch();
    const [color] = useContext(themeContext);

    const images = useAppSelector(state => state.chapters.chapterImages);
    const loading = useAppSelector(state => state.chapters.imagesLoading);
    const error = useAppSelector(state => state.chapters.imagesError);
    const chapters = useAppSelector(state => state.chapters.chapters);

    const currentChapterIndex = chapters.findIndex(ch => ch.id === chapterId);
    const hasNextChapter = currentChapterIndex < chapters.length - 1;
    const hasPrevChapter = currentChapterIndex > 0;

    useEffect(() => {
        if (chapterId) {
            dispatch(fetchChapterImages({ chapterId }));
        }
    }, [chapterId, dispatch]);

    if (loading) {
        return (
            <div className="spinner-fullscreen">
                <div className="spinner-container spinner-container__img">
                    <span className="loader"></span>
                </div>
            </div>
        );
    }

    if (error) return <p>Error loading page: {error}</p>;

    return (
        <div className={`chapter background-${color}`}>
            <div className="container">
                <ChapterViewer
                    images={images}
                    chapters={chapters}
                    currentChapterIndex={currentChapterIndex}
                    hasNextChapter={hasNextChapter}
                    hasPrevChapter={hasPrevChapter}
                />
            </div>
        </div>
    );
};

export default ChapterPage;
