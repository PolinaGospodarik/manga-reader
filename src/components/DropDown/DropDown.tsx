import React, {useContext} from 'react';
import "./DropDown.css";
import {useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from "@/hooks";
import {logout} from "@/redux/slice/users";
import {themeContext} from "@/roviders/ThemeContext";
import {faBookmark } from "@fortawesome/free-regular-svg-icons";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";

const DropDown = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [color, setColor] = useContext(themeContext);

    const user = useAppSelector((state) => state.users.user);

    return (
        <div className={`dropdown-content dropdown-${color}`}>
            <div className="dropdown-menu">
                <div className='dropdown-theme'>
                    <button className={`dropdown-item-icon dropdown-icon-${color} selection-${color}`} onClick={() => setColor("light")}>
                        <FontAwesomeIcon className='dropdown-icon' icon={faSun}/>
                        <span className={`dropdown-item-icon__title text-${color}`}>Light</span>
                    </button>
                    <button className={`dropdown-item-icon dropdown-icon-${color} selection-${color}`} onClick={() => setColor("dark")}>
                        <FontAwesomeIcon className='dropdown-icon' icon={faMoon}/>
                        <span className={`dropdown-item-icon__title text-${color}`}>Dark</span>
                    </button>
                </div>

                <button
                    onClick={() => navigate(user ? '/favorites' : '/login')}
                    className={`dropdown-button text-${color} selection-${color}`}
                >
                    <FontAwesomeIcon className={`dropdown-button__icon text-${color}`} icon={faBookmark} />
                    <span>My Favorites</span>
                </button>

                {user ? (
                    <button
                        onClick={() => {
                            dispatch(logout());
                            window.location.reload();
                        }}
                        className={`dropdown-button text-${color} selection-${color}`}
                    >
                        <FontAwesomeIcon className={`dropdown-button__icon text-${color}`} icon={faRightFromBracket} />
                        Sign Out
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            navigate('/login');
                        }}
                        className={`dropdown-button text-${color} selection-${color}`}
                    >
                        Sign In
                    </button>
                )}
            </div>
        </div>
    );
};

export default DropDown;
