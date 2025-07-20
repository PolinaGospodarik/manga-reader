import React, {useContext} from 'react';
import "./StatusTabs.css"
import {themeContext} from "@/roviders/ThemeContext";

type Status = {
    label: string;
    value: string;
};

type StatusTabsProps = {
    statuses: Status[];
    activeStatus: string;
    onChange: (status: string) => void;
    className?: string;
};

const StatusTabs: React.FC<StatusTabsProps> = ({ statuses, activeStatus, onChange, className }) => {
    const [color] = useContext(themeContext);

    return (
        <div className={`libraries__tabs grey-${color} ${className || ''}`}>
            {statuses.map(({ label, value }) => (
                <button
                    key={value}
                    className={`libraries__tab secondary-text-${color} ${activeStatus === value ? 'active' : ''}`}
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
