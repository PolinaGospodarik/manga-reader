import AddToLibraryModal from "@/components/LibraryModal/LibraryModal";

export type AuthResponse = {
    user: boolean
    access_token: string;
    refresh_token: string;
}

export type UsersState = {
    // access_token: string | null;
    // refresh_token: string | null;
    user: boolean;
    loading: boolean;
    error: string | null;
    permissions: string[];
}


//initialState MANGALIST
export type MangaState = {
    mangaPopular: Manga[];
    mangaLatest: Manga[];
    mangaItem: MangaApiResponse | null;
    loading: boolean;
    error: string | null;
};

export type Manga = {
    id: string;
    attributes: MangaAttributes;
    relationships: Relationship[];
};

export type MangaAttributes = {
    title: {
        en: string;
    };
    description: {
        en: string;
    };
    tags: Tag[];
    [key: string]: any;
};

export type Tag = {
    id: string;
    type: "tag";
    attributes: TagAttributes;
};

export type TagAttributes = {
    name: TagName;
    description: TagName;
    group: string;
    version: number;
};

export type TagName = {
    en: string;
};

export type Relationship = {
    id: string;
    type: string;
    attributes: RelationshipAttributes;
}

export type RelationshipAttributes = {
    name: string;
	fileName?: string | undefined;
    [key: string]: any;
}



// Пример типов

export type MangaDetails ={
    id: string;
    attributes: MangaAttributes & { contentRating?: string };
    relationships: Relationship[];
}

export type ListState ={
    mangaSelfPublished: {
        [listId: string]: {
            mangaData: MangaDetails[];
            listName: string;
        };
    };
    loading: boolean;
    error: string | null;
}

//MangaId
export type MangaApiResponse = {
    result: string;
    response: string;
    data: Manga;
    statistics: MangaStatisticsResponse;
    rating?: {
        average: number;
        bayesian: number;
    };
    follows?: number;
};



export type MangaStatisticsResponse = {
    statistics: {
        [key: string]: {
            rating: MangaRating;
            follows: number;
        };
    };
}

export type MangaRating = {
    average: number;
    bayesian: number;
}

//Search
export type SearchState = {
    searchResults: Manga[];
    searchValue: string;
    pageSearchValue: string,
    currentOffset: number;
    loading: boolean;
    error: string | null;
    totalPages: number,
    totalResults: number,
    limit: number,
};


export type MangaSearch ={
    data: Manga[];
    result: string;
    limit: number;
    offset: number;
    total: number;
}

export type PaginationSearch ={
    limit: number;
    currentOffset: number;
    onPrev: () => void;
    onNext: () => void;
}

//Context
export type TContext =[
    string,
    (value: string) => void
]

//favorites
export type Library ={
    libraries: LibraryItem[],
    loading: boolean,
    error: string | null,
}
export type AddToLibrariesParams ={
    mangaId: string;
    status?: 'reading' | 'on_hold' | 'plan_to_read' | 'dropped' | 're_reading'|'completed';
    sessionToken: string;
}
export type LibraryItem ={
    mangaId: string;
    status?: 'reading' | 'on_hold' | 'plan_to_read' | 'dropped' | 're_reading'|'completed';
}

// LibraryModal
export type LibraryModalType = {
    imageSrc: string | null;
    title: string;
    onConfirm: (status: string) => void;
    onCancel: () => void;
};
// AccentButton
export type AccentButtonType = {
    children: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
};


export type CustomSelectType = {
    defaultValue: string;
    onChange: (value: string) => void;
};