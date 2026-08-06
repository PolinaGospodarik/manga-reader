import React, {useContext} from 'react';
import styles from "./Pagination.module.css"
import {TPaginationSearch} from "@/types/types";
import {useAppSelector} from "@/hooks";
import {themeContext} from "@/roviders/ThemeContext";

const Pagination: React.FC<TPaginationSearch> = ({  limit, currentOffset, onPrev, onNext }) => {
    const currentPage = Math.floor(currentOffset / limit) + 1;
    const totalPages = useAppSelector((state)=> state.search.totalPages);

    const [color] = useContext(themeContext);

    return (
        <div className={`${styles.pagination}`}>
            <a href="#" className={`${styles["pagination__button"]}  ${currentPage === 1 ? `${styles.disabled}` : ''}`}  onClick={onPrev}>
                Previous
            </a>
            <span className={`text-${color}`}>
                Page {currentPage} of {totalPages}
            </span>
            <a href="#" className={`${styles["pagination__button"]} ${currentPage === totalPages ? `${styles.disabled}` : ''}`} onClick={onNext}>
                Next
            </a>
        </div>
    );
};

export default Pagination;
