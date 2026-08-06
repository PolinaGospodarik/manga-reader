import React, {useContext, useState} from 'react';
import styles from './LibraryModal.module.css';
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import {themeContext} from "@/roviders/ThemeContext";
import { TLibraryModal } from "@/types/types.js";

import Button from "../AccentButton/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const statusMap: Record<string, string> = {
    'Reading': 'reading',
    'On Hold': 'on_hold',
    'Dropped': 'dropped',
    'Plan to Read': 'plan_to_read',
    'Completed': 'completed',
    'Re-Reading': 're_reading',
};

const LibraryModal: React.FC<TLibraryModal> = ({ imageSrc, title, onConfirm, onCancel }) => {
    const [selectedStatus, setSelectedStatus] = useState('Reading');
    const [color] = useContext(themeContext);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div className={`${styles["modal-overlay"]}`} onClick={handleOverlayClick}>
            <div className={`${styles.modal} background-${color}`}>
                <button className={`${styles["modal-close"]}`} onClick={onCancel}>
                    <FontAwesomeIcon className={`${styles["modal-close__icon"]} text-${color}`} icon={faXmark} />
                </button>
                <h2 className={`${styles.modal__title} text-${color}`}>Add to library</h2>
                <div className="modal-content">
                    <div className={`${styles["modal-content-favorite"]}`}>
                        <div className={`${styles["modal-content-favorite-light"]}`}>
                            {imageSrc && <img src={imageSrc} alt="cover" className={`${styles["odal-image"]}`} />}
                        </div>
                        <div className={`${styles["modal-content-favorite-right"]}`}>
                            <h3 className={`${styles["modal-content-favorite-right__title"]} text-${color}`}>{title}</h3>
                            <h4 className={`${styles["modal-content-favorite-right__title-select"]} text-${color}`}>Reading Status</h4>
                            <CustomSelect
                                onChange={(value) => setSelectedStatus(value)}
                                defaultValue={selectedStatus}
                            />
                        </div>
                    </div>

                    <div className={`${styles["modal-actions"]}`}>
                        <button className={`${styles["modal-actions__button"]} grey-${color} selection-${color} text-${color}`} onClick={onCancel}>Cancel</button>
                        <Button
                            variant="orange"
                            className={`${styles["modal-actions__button"]}`}
                            onClick={() => onConfirm(statusMap[selectedStatus] || 'reading')}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibraryModal;
