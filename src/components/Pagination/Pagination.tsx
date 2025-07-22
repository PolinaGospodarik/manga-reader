import React, {useContext} from 'react';
import "./Pagination.css"
import {TPaginationSearch} from "@/types/types";
import {useAppSelector} from "@/hooks";
import {themeContext} from "@/roviders/ThemeContext";

const Pagination: React.FC<TPaginationSearch> = ({  limit, currentOffset, onPrev, onNext }) => {
    const currentPage = Math.floor(currentOffset / limit) + 1;
    const totalPages = useAppSelector((state)=> state.search.totalPages);

    const [color] = useContext(themeContext);

    return (
        <div className="pagination">
            <a href="#" className={`pagination__button  ${currentPage === 1 ? 'disabled' : ''}`}  onClick={onPrev}>
                Previous
            </a>
            <span className={`text-${color}`}>
                Page {currentPage} of {totalPages}
            </span>
            <a href="#" className={`pagination__button ${currentPage === totalPages ? 'disabled' : ''}`} onClick={onNext}>
                Next
            </a>
        </div>
    );
};

export default Pagination;
