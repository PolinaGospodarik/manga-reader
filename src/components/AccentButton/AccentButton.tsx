import React from 'react';
import './AccentButton.css';
import {AccentButtonType} from "@/types/types";

const AccentButton: React.FC<AccentButtonType> = ({children, onClick, type = 'button', className = '', disabled = false,}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`orange-button ${className}`}
        >
            {children}
        </button>
    );
};

export default AccentButton;
