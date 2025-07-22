import React, {useContext, useEffect, useState} from 'react';
import "./MangaPopularSlider.css";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchMangaPopular } from "@/redux/slice/manga";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation } from 'swiper/modules';

import MangaPopularSlide from "../MangaPopularSlide/MangaPopularSlide";
import {themeContext} from "@/roviders/ThemeContext";
import {NavigationButtons} from "@/components/NavigationButtons/NavigationButtons";


const MangaPopularSlider = () => {

    const dispatch = useAppDispatch();
    const [color] = useContext(themeContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const {mangaPopular, loading, error} = useAppSelector((state) => state.manga);

    useEffect(() => {
        dispatch(fetchMangaPopular())
    }, [dispatch]);

    return (
        <>
            <div className="manga-slider">
                {loading ? (
                    <div className="spinner-container spinner-container__img">
                        <span className="loader"></span>
                    </div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : mangaPopular && mangaPopular.length > 0 ? (
                    <>
                        <Swiper
                            spaceBetween={0}
                            slidesPerView={1}
                            onSlideChange={(swiper: any) => setCurrentIndex(swiper.realIndex)}
                            navigation={{
                                nextEl: '.custom-next',
                                prevEl: '.custom-prev',
                            }}
                            loop={true}
                            modules={[Navigation]}
                        >
                            {mangaPopular.map((manga, index) => (
                                <SwiperSlide className={"manga-popular"} key={manga.id}>
                                    <MangaPopularSlide manga={manga} index={index}/>
                                </SwiperSlide>
                            ))}
                            <div className="text-bottom__other">
                                <div className={`other__numbering text-${color}`}>NO.{currentIndex + 1}</div>
                                <div className="other__navigation"><NavigationButtons/></div>
                            </div>
                        </Swiper>
                    </>
                ) : (
                    <div>No manga available</div>
                )}
            </div>
        </>
    );
};


export default MangaPopularSlider;