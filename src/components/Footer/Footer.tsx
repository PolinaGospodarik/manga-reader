import React, {useContext} from 'react';
import "./Footer.css"
import {themeContext} from "@/roviders/ThemeContext";

const Footer = () => {
    const [color] = useContext(themeContext);
    const currentYear = new Date().getFullYear();

    return (
        <>
            <div className={`footer background-${color}`}>
                <span className={`footer-name text-${color}`}>© MangaDex {currentYear}</span>
                <a className={`footer-link`} href="https://mangadex.org/contact">Сontact us</a>
            </div>
        </>
    );
};

export default Footer;