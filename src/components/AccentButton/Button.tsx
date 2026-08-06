import React from 'react';
import styles from './Button.module.css';
import {TAccentButton} from "@/types/types";

const Button: React.FC<TAccentButton> = ({children, onClick, type = 'button', className = '', disabled = false, variant = 'orange',}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
            ${styles.accentButton} 
            ${variant === "orange" ? styles.orange : ""}
            ${disabled ? styles.disabled : ""}
            ${className}`}
        >
            {children}
        </button>
    );
};


export default Button;
