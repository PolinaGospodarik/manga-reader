import React, {useContext} from 'react';
import styles from "./DropDown.module.css";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector } from "@/hooks";
import {logout} from "@/redux/slice/users";
import {themeContext} from "@/roviders/ThemeContext";

import {FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {faBookmark } from "@fortawesome/free-regular-svg-icons";
import {faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const DropDown = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [color, setColor] = useContext(themeContext);

    const user = useAppSelector((state) => state.users.user);

    return (
        <div className={`${styles["dropdown-content"]} dropdown-${color}`}>
            <div className={`${styles["dropdown-menu"]}`}>
                <div className={`${styles["dropdown-theme"]}`}>
                    <button className={`${styles["dropdown-item-icon"]} dropdown-icon-${color} selection-${color}`} onClick={() => setColor("light")}>
                        <FontAwesomeIcon className={`${styles["dropdown-icon"]}`} icon={faSun}/>
                        <span className={`${styles["dropdown-item-icon__title"]} text-${color}`}>Light</span>
                    </button>
                    <button className={`${styles["dropdown-item-icon"]} dropdown-icon-${color} selection-${color}`} onClick={() => setColor("dark")}>
                        <FontAwesomeIcon className='dropdown-icon' icon={faMoon}/>
                        <span className={`${styles["dropdown-item-icon__title"]} text-${color}`}>Dark</span>
                    </button>
                </div>

                <button
                    onClick={() => navigate(user ? '/favorites' : '/login')}
                    className={`${styles["dropdown-button"]} text-${color} selection-${color}`}
                >
                    <FontAwesomeIcon className={`${styles["dropdown-button__icon"]} text-${color}`} icon={faBookmark} />
                    <span>My Favorites</span>
                </button>

                {user ? (
                    <button
                        onClick={() => {
                            dispatch(logout());
                            window.location.reload();
                        }}
                        className={`${styles["dropdown-button"]} text-${color} selection-${color}`}
                    >
                        <FontAwesomeIcon className={`${styles["dropdown-button__icon"]} text-${color}`} icon={faRightFromBracket} />
                        Sign Out
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            navigate('/login');
                        }}
                        className={`${styles["dropdown-button"]} text-${color} selection-${color}`}
                    >
                        Sign In
                    </button>
                )}
            </div>
        </div>
    );
};

export default DropDown;
