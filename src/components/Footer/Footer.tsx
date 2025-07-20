import React, {useContext} from 'react';
import "./Footer.css"
import {themeContext} from "@/roviders/ThemeContext";

const Footer = () => {
    const [color] = useContext(themeContext);
    return (
        <>
            <div className="footer">
                <span className={`footer-name text-${color}`}>© MangaDex 2025</span>
                <a className={`footer-link`} href="https://mangadex.org/contact">Сontact us</a>
            </div>
        </>
    );
};

export default Footer;