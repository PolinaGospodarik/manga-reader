import React, {useState, useEffect, useContext} from 'react';
import "./Header.css";
import logoImg from "../../img/mangadex-logo.svg";
import logoTextBlack from "../../img/mangadex-wordmark-black.svg";
import logoTextWhite from "../../img/mangadex-wordmark-white.svg";
import avatarDefault from "../../img/avatar.png"
import { useNavigate } from "react-router-dom";
import SearchInput from "../SearchInput/SearchInput";
import DropDown from "../DropDown/DropDown";
import {useAppSelector} from "../../hooks";
import {themeContext} from "../../roviders/ThemeContext";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [avatar, setAvatar] = useState(avatarDefault);
    const navigate = useNavigate();
    const [color] = useContext(themeContext);

    const user = useAppSelector((state) => state.users.user);

    useEffect(() => {
        window.addEventListener('scroll', () => setIsScrolled(window.scrollY > 50));
    }, []);

    useEffect(() => {
        setAvatar( user ? "https://mangadex.org/img/avatar.png" : avatarDefault)
    }, [user])

    const handleClickLogo = () => {
        navigate("/");
    };

    return (
        <div className={`header ${isScrolled ? `scrolled background-${color}` : ''}`}>
            <div className="container">
                <div className="header-wrapper">
                    <a href="#" onClick={handleClickLogo}>
                        <img src={logoImg} alt="logo-img"/>
                        <img
                            src={color === "dark" ? logoTextWhite : logoTextBlack}
                            alt="Logo"
                            className="logo-wordmark"
                        />
                    </a>
                    <div className="header-right">
                        <SearchInput/>
                        <div className={`header-right__avatar grey-${color}`}
                             onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            <img className="avatar" src={avatar} alt="avatar"/>
                        </div>
                    </div>
                </div>
            </div>
            {isDropdownOpen && <DropDown/>}
        </div>
    );
};

export default Header;
