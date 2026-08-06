import React, {useContext} from 'react';
import styles from "./Footer.module.css"
import {themeContext} from "@/roviders/ThemeContext";

const Footer = () => {
    const [color] = useContext(themeContext);
    const currentYear = new Date().getFullYear();

    return (
        <>
            <div className={`${styles.footer} background-${color}`}>
                <span className={`${styles["footer-name"]} text-${color}`}>© MangaDex {currentYear}</span>
                <a className={`${styles["footer-link"]}`} href="https://mangadex.org/contact">Сontact us</a>
            </div>
        </>
    );
};

export default Footer;