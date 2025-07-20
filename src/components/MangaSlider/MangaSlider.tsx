import React, {useContext, useEffect} from 'react';
import './MangaSlider.css';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Pagination } from 'swiper/modules';
import { fetchMangaSelfPublished } from '../../redux/slice/list';
import MangaSlide from '../MangaSlide/MangaSlide';
import {MangaDetails} from '../../types/types';
import {themeContext} from "@/roviders/ThemeContext";

interface MangaSliderProps {
    listId: string;
    slidesPerView?: number;
}

const MangaSlider: React.FC<MangaSliderProps> = ({ listId, slidesPerView= 5}) => {
    const dispatch = useAppDispatch();
    const [color] = useContext(themeContext);

    const mangaData = useAppSelector(
        (state) => state.list.mangaSelfPublished[listId]?.mangaData
    );
    const listName = useAppSelector(
        (state) => state.list.mangaSelfPublished[listId]?.listName
    );
    const loading = useAppSelector((state) => state.list.loading);
    const error = useAppSelector((state) => state.list.error);

    useEffect(() => {
        if (listId) {
            dispatch(fetchMangaSelfPublished({ listId, contentRating: ['safe', 'suggestive']}));
        }
    }, [dispatch, listId]);

    return (
        <div className="slider">
            <div className="container">
                <div className={`slider__text text-${color}`}>
                    <h3>{listName || 'Загрузка...'}</h3>
                </div>

                {loading ? (
                    <div>Загрузка...</div>
                ) : error ? (
                    <div>{`Ошибка: ${error}`}</div>
                ) : (
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={slidesPerView}
                        loop={true}
                        modules={[Pagination]}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                    >
                        {mangaData && mangaData.length > 0 ? (
                            mangaData.map((manga: MangaDetails, index: number) => (
                                <SwiperSlide key={manga.id}>
                                    <MangaSlide manga={manga} index={index}/>
                                </SwiperSlide>
                            ))
                        ) : (
                            <div>Нет доступной манги</div>
                        )}
                    </Swiper>
                )}
            </div>
        </div>
    );
};

export default MangaSlider;
