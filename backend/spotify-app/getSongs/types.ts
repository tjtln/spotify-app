export type SongInfo = {
    name: string;
    artist: string;
};

export type DuplicateSongs = {
    [songId: string]: SongInfo;
};

export type Song = {
    name: string;
    artist: string;
    id: string;
}

export type Songs = Song[]


export type SpotifyResponse = {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: SpotifyItem[];
}

type SpotifyItem = {
    added_at: string;
    track: Track
}

type Track = {
    artists: SpotifyArtist[];
    id: string;
    name: string;
    album: SpotifyAlbum;
}

type SpotifyArtist = {
    id: string;
    name: string;
}

type SpotifyAlbum = {
    id: string;
    images: SpotifyImage[];
}

type SpotifyImage = {
    url: string;
    height: number;
    width: number;
}

export type AllSongs = {
    [songName: string]: string[]
}