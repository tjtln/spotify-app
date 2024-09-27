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
    
}