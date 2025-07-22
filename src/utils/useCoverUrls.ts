import axios from "axios";
import {TRelationship} from "@/types/types";

export const fetchImage = async (url: string) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error("Ошибка загрузки изображения:", err);
    }
};

export const getProxedImgaes= (manga:any) => {
    if (!manga || !manga.relationships) return [null, null];

    const [coverArtIndex] = getIndexes(manga);
    const cover = manga.relationships?.[coverArtIndex]?.attributes;
    const fileName = cover?.fileName;

    return fileName
        ? [
            `https://manga-proxy.netlify.app/images/cover/${manga.id}/${fileName}.256.jpg`,
            `https://manga-proxy.netlify.app/images/cover/${manga.id}/${fileName}`
        ] : [null, null];
}

export const getIndexes = (manga:any) =>{
    const typesToFind = ['cover_art', 'author', 'artist'];
    return typesToFind.map((type) =>
        manga.relationships.findIndex(
            (relationship: TRelationship) => relationship.type === type
        )
    );
}
