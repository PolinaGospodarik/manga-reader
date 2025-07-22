export type TAuthResponse = {
    user: boolean
    access_token: string;
    refresh_token: string;
}

export type TUsersState = {
    user: boolean;
    loading: boolean;
    error: string | null;
    permissions: string[];
}


//initialState MANGALIST
export type TMangaState = {
    mangaPopular: TManga[];
    mangaLatest: TManga[];
    mangaItem: TMangaApiResponse | null;
    loading: boolean;
    error: string | null;
};

export type TManga = {
    id: string;
    attributes: TMangaAttributes;
    relationships: TRelationship[];
};

export type TMangaAttributes = {
    title: {
        en: string;
    };
    description: {
        en: string;
    };
    tags: TTag[];
    [key: string]: any;
};

export type TTag = {
    id: string;
    type: "tag";
    attributes: TTagAttributes;
};

export type TTagAttributes = {
    name: TTagName;
    description: TTagName;
    group: string;
    version: number;
};

export type TTagName = {
    en: string;
};

export type TRelationship = {
    id: string;
    type: string;
    attributes: TRelationshipAttributes;
}

export type TRelationshipAttributes = {
    name: string;
	fileName?: string | undefined;
    [key: string]: any;
}



export type TMangaDetails ={
    id: string;
    attributes: TMangaAttributes & { contentRating?: string };
    relationships: TRelationship[];
}

export type TListState ={
    mangaSelfPublished: {
        [listId: string]: {
            mangaData: TMangaDetails[];
            listName: string;
        };
    };
    loading: boolean;
    error: string | null;
}

//MangaId
export type TMangaApiResponse = {
    result: string;
    response: string;
    data: TManga;
    statistics: TMangaStatisticsResponse;
    rating?: {
        average: number;
        bayesian: number;
    };
    follows?: number;
};



export type TMangaStatisticsResponse = {
    statistics: {
        [key: string]: {
            rating: TMangaRating;
            follows: number;
        };
    };
}

export type TMangaRating = {
    average: number;
    bayesian: number;
}

// MangaSlider
export type TMangaSlider ={
    listId: string;
    slidesPerView?: number;
}


//Search
export type TSearchState = {
    searchResults: TManga[];
    searchValue: string;
    pageSearchValue: string,
    currentOffset: number;
    loading: boolean;
    error: string | null;
    totalPages: number,
    totalResults: number,
    limit: number,
};


export type TMangaSearch ={
    data: TManga[];
    result: string;
    limit: number;
    offset: number;
    total: number;
}

export type TPaginationSearch ={
    limit: number;
    currentOffset: number;
    onPrev: () => void;
    onNext: () => void;
}

// MangaInfo
export type TMangaInfo = {
    manga: TMangaApiResponse;
};

//Context
export type TContext =[
    string,
    (value: string) => void
]

//libraries
export type TLibrary ={
    libraries: TLibraryItem[],
    loading: boolean,
    error: string | null,
}
export type TAddToLibrariesParams ={
    mangaId: string;
    status?: 'reading' | 'on_hold' | 'plan_to_read' | 'dropped' | 're_reading'|'completed';
    sessionToken: string;
}
export type TLibraryItem ={
    mangaId: string;
    status?: 'reading' | 'on_hold' | 'plan_to_read' | 'dropped' | 're_reading'|'completed';
}

// StatusTabs
export type TStatus = {
    label: string;
    value: string;
};

export type TTagList = {
    tags: TTag[];
    className?: string;
}


export type TStatusTabs = {
    statuses: TStatus[];
    activeStatus: string;
    onChange: (status: string) => void;
    className?: string;
};

// LibraryModal
export type TLibraryModal = {
    imageSrc: string | null;
    title: string;
    onConfirm: (status: string) => void;
    onCancel: () => void;
};

// LibrariesList
export type TLibrariesList = {
    status: string;
    user?: boolean;
};

// AccentButton
export type TAccentButton = {
    children: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
    variant: string,
};

// CustomSelect
export type TCustomSelect = {
    defaultValue: string;
    onChange: (value: string) => void;
};
export type TOption = { value: string; label: string };

// chapters
export type TChapter = {
    id: string;
    chapter: string | null;
    title: string | null;
    volume: string | null;
};

export type TChaptersState = {
    chapters: TChapter[];
    loading: boolean;
    error: string | null;

    chapterImages: string[];
    imagesLoading: boolean;
    imagesError: string | null;
};
