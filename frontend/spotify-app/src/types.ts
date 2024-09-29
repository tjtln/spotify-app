export type songsResponse = {
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
