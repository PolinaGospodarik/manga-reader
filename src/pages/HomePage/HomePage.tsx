import React, {useContext} from 'react';
import MangaPopularSlider from "../../components/MangaPopularSlider/MangaPopularSlider";
import MangaList from "../../components/MangaList/MangaList";
import MangaSlider from "../../components/MangaSlider/MangaSlider";
import {themeContext} from "../../roviders/ThemeContext";
import Footer from "@/components/Footer/Footer";

const HomePage = () => {
    const [color, setColor] = useContext(themeContext);
    return (
        <>
            <div className={`background-${color}`}>
                <MangaPopularSlider></MangaPopularSlider>
                <MangaList></MangaList>
                <MangaSlider listId="f66ebc10-ef89-46d1-be96-bb704559e04a"/>
                <MangaSlider listId="805ba886-dd99-4aa4-b460-4bd7c7b71352"/>
                <MangaSlider listId="54736a5c-eb7f-4844-971b-80ee171cdf29"/>
                <Footer/>
            </div>

        </>
    );
};

export default HomePage;