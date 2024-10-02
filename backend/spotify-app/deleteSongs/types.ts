export type returnObject = {
    duplicateSongs: Song[];
    allSongs: Song[];
}

export type Song = {
    name: string;
    id: string;
    artists: string[];
    album: string;
    albumImage: string;
};

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
    name: string;
    images: SpotifyImage[];
}

type SpotifyImage = {
    url: string;
    height: number;
    width: number;
}

export type SongsObject = {
    [songName: string]: string[]
}