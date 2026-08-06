import React, {useContext} from 'react';
import styles from "./StatusTabs.module.css"
import {themeContext} from "@/roviders/ThemeContext";
import {TStatusTabs} from "@/types/types";

const StatusTabs: React.FC<TStatusTabs> = ({ statuses, activeStatus, onChange, className }) => {
    const [color] = useContext(themeContext);

    return (
        <div className={`${styles["libraries__tabs"]} grey-${color} ${className || ''}`}>
            {statuses.map(({ label, value }) => (
                <button
                    key={value}
                    className={`${styles["libraries__tab"]} secondary-text-${color} ${activeStatus === value ? 'active' : ''}`}
                    onClick={() => onChange(value)}
                    type="button"
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default StatusTabs;
