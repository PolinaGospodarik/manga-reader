import React, {useContext, useState} from 'react';
import './LibraryModal.css';
import { LibraryModalType } from "@/types/types.js"
import AccentButton from "@/components/AccentButton/AccentButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import {themeContext} from "@/roviders/ThemeContext";

const statusMap: Record<string, string> = {
    'Reading': 'reading',
    'On Hold': 'on_hold',
    'Dropped': 'dropped',
    'Plan to Read': 'plan_to_read',
    'Completed': 'completed',
    'Re-Reading': 're_reading',
};

const LibraryModal: React.FC<LibraryModalType> = ({ imageSrc, title, onConfirm, onCancel }) => {
    const [selectedStatus, setSelectedStatus] = useState('Reading');
    const [color] = useContext(themeContext);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className={`modal background-${color}`}>
                <button className="modal-close" onClick={onCancel}>
                    <FontAwesomeIcon className={`modal-close__icon text-${color}`} icon={faXmark} />
                </button>
                <h2 className={`modal__title text-${color}`}>Add to library</h2>
                <div className="modal-content">
                    <div className="modal-content-favorite">
                        <div className="modal-content-favorite-light">
                            {imageSrc && <img src={imageSrc} alt="cover" className="modal-image" />}
                        </div>
                        <div className="modal-content-favorite-right">
                            <h3 className={`modal-content-favorite-right__title text-${color}`}>{title}</h3>
                            <h4 className={`modal-content-favorite-right__title-select text-${color}`}>Reading Status</h4>
                            <CustomSelect
                                onChange={(value) => setSelectedStatus(value)}
                                defaultValue={selectedStatus}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button className={`modal-actions__button grey-${color} selection-${color} text-${color}`} onClick={onCancel}>Cancel</button>
                        <AccentButton
                            className="modal-actions__button"
                            onClick={() => onConfirm(statusMap[selectedStatus] || 'reading')}
                        >
                            Add
                        </AccentButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibraryModal;
