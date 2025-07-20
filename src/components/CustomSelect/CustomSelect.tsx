import React, { useContext, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { CustomSelectType } from "@/types/types";
import { themeContext } from "@/roviders/ThemeContext";

const statusOptions = [
    { value: 'Reading', label: 'Reading' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Dropped', label: 'Dropped' },
    { value: 'Plan to Read', label: 'Plan to Read' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Re-Reading', label: 'Re-Reading' },
];

type OptionType = { value: string; label: string };

const CustomSelect: React.FC<CustomSelectType> = ({ defaultValue, onChange }) => {
    const [color] = useContext(themeContext);
    const isDark = color === "dark";

    const initialOption = statusOptions.find(opt => opt.value === defaultValue) || statusOptions[0];
    const [selectedOption, setSelectedOption] = useState<OptionType>(initialOption);

    useEffect(() => {
        onChange(selectedOption.value); // 👉 передаём в родителя
    }, [selectedOption, onChange]);

    const handleChange = (newValue: SingleValue<OptionType>) => {
        if (newValue) {
            setSelectedOption(newValue);
        }
    };

    const customStyles = {
        control: (base: any, state: any) => ({
            ...base,
            backgroundColor: isDark ? "rgb(56, 56, 58)" : "rgba(211, 211, 211, 0.76)",
            borderRadius: "5px",
            padding: "5px 10px",
            width: "250px",
            borderColor: state.isFocused
                ? "rgb(255,103,64)"
                : isDark
                    ? "none"
                    : "#fff",
            boxShadow: state.isFocused ? "0 0 0 1px rgb(203, 82, 49)" : "none",
            cursor: "pointer",
            fontSize: "18px",
            color: "#000",
            textAlign: "left",
            '&:hover': {
                borderColor: state.isFocused ? 'rgb(255,103,64)' : '#ccc',
            },
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: isDark ? "#e1e1e1" : "#000",
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: isDark ? "#0e0f12" : "#fff",
            borderRadius: "5px",
            marginTop: 0,
            zIndex: 9999,
        }),
        menuList: (provided: any) => ({
            ...provided,
            backgroundColor: isDark ? "#0e0f12" : "#fff",
            padding: 0,
            borderRadius: "5px",
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused
                ? isDark
                    ? "rgb(78, 78, 80)"
                    : "rgb(204, 204, 204)"
                : isDark
                    ? "rgb(56, 56, 58)"
                    : "rgba(211, 211, 211, 0.76)",
            color: isDark ? "#e1e1e1" : "#000",
            cursor: "pointer",
            textAlign: "left",
        }),
        dropdownIndicator: (provided: any) => ({
            ...provided,
            color: isDark ? "#ccc" : "#000",
        }),
        indicatorSeparator: () => ({
            display: "none",
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: isDark ? "#ffffff" : "#1e1e1e",
        }),
    };

    return (
        <Select
            options={statusOptions}
            value={selectedOption}
            onChange={handleChange}
            styles={customStyles}
            isSearchable={false}
        />
    );
};

export default CustomSelect;