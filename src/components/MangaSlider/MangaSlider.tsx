import React, {useContext, useEffect} from 'react';
import styles from './MangaSlider.module.css';
import MangaSlide from '../MangaSlide/MangaSlide';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {TMangaDetails, TMangaSlider} from '@/types/types';
import {themeContext} from "@/roviders/ThemeContext";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { fetchMangaSelfPublished } from '@/redux/slice/list';




const MangaSlider: React.FC<TMangaSlider> = ({ listId, slidesPerView= 5}) => {
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
                <div className={`${styles["slider__text"]} text-${color}`}>
                    <h3>{listName || 'Loading...'}</h3>
                </div>

                {loading ? (
                    <div className="spinner-container spinner-container__img">
                        <span className="loader"></span>
                    </div>
                ) : error ? (
                    <div>{`Error: ${error}`}</div>
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
                            mangaData.map((manga: TMangaDetails, index: number) => (
                                <SwiperSlide key={manga.id}>
                                    <MangaSlide manga={manga} index={index}/>
                                </SwiperSlide>
                            ))
                        ) : (
                            <div>No manga available</div>
                        )}
                    </Swiper>
                )}
            </div>
        </div>
    );
};

export default MangaSlider;
