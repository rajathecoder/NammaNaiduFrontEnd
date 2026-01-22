export interface HoroscopeData {
    rasi: string;
    natchathiram: string;
    birthPlace: string;
    birthTime: string;
}

export interface FamilyData {
    fatherName: string;
    fatherOccupation: string;
    fatherStatus: 'alive' | 'late';
    motherName: string;
    motherOccupation: string;
    motherStatus: 'alive' | 'late';
    siblings: Array<{ name: string; gender: string; occupation?: string }>;
}

export interface Sibling {
    name: string;
    gender: string;
    occupation?: string;
}

export interface PhotoUpload {
    photoplacement: number;
    photobase64: string;
    preview: string;
}

export interface ProofPhoto {
    base64: string;
    preview: string;
}

export type HobbyTab = 'hobbies' | 'music' | 'reading' | 'movies' | 'sports' | 'food' | 'languages';

export interface HobbySelections {
    hobbies: Set<string>;
    musicGenres: Set<string>;
    bookTypes: Set<string>;
    movieTypes: Set<string>;
    sports: Set<string>;
    cuisines: Set<string>;
    languages: Set<string>;
}

export interface ShowMoreStates {
    hobbies: boolean;
    music: boolean;
    books: boolean;
    movies: boolean;
    sports: boolean;
    cuisines: boolean;
    languages: boolean;
}

