import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchChapterImages } from "@/redux/slice/chapters";

const ChapterPage = () => {
    const { chapterId } = useParams<{ chapterId: string }>();
    const dispatch = useAppDispatch();

    const images = useAppSelector(state => state.chapters.chapterImages);
    const loading = useAppSelector(state => state.chapters.imagesLoading);
    const error = useAppSelector(state => state.chapters.imagesError);

    useEffect(() => {
        if (chapterId) {
            dispatch(fetchChapterImages({ chapterId }));
        }
    }, [chapterId, dispatch]);

    if (loading) return <p>Загрузка страницы...</p>;
    if (error) return <p>Ошибка загрузки страницы: {error}</p>;

    return (
        <div>
            <h1>Чтение главы</h1>
            <div>
                {images.map((url, index) => (
                    <img key={index} src={url} alt={`Page ${index + 1}`} style={{ width: "100%", marginBottom: 10 }} />
                ))}
            </div>
        </div>
    );
};

export default ChapterPage;
