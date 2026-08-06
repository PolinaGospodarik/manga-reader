import React, {useContext} from 'react';
import styles from "./NavigationButtons.module.css"
import { useSwiper } from 'swiper/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {themeContext} from "@/roviders/ThemeContext";

export const NavigationButtons = () => {
    const swiper = useSwiper();
    const [color] = useContext(themeContext);

    const handlePrev = () => {
        swiper?.slidePrev();
    };

    const handleNext = () => {
        swiper?.slideNext();
    };

    return (
        <>
            <button className={`${styles["custom-prev"]} text-${color}`} onClick={handlePrev}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button className={`${styles["custom-next"]} text-${color}`} onClick={handleNext}>
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </>
    );
};
