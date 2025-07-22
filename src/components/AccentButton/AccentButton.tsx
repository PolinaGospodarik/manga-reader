import React from 'react';
import './AccentButton.css';
import {TAccentButton} from "@/types/types";

const AccentButton: React.FC<TAccentButton> = ({children, onClick, type = 'button', className = '', disabled = false, variant = 'orange',}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${variant}-button ${className}`}
        >
            {children}
        </button>
    );
};


export default AccentButton;
