import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import { SpotifyResponse, Song, SongsObject} from './types';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const token = event.queryStringParameters?.token;
    async function getTotal() {
        const options = {
            method: 'GET',
            url: `https://api.spotify.com/v1/me/tracks?limit=1&offset=0`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        return axios<SpotifyResponse>(options)
            .then(response => {
                return response.data.total;
            });
    }
    async function getAllSongs() {
        const allSongs: Song[] = [];
        const totalSongs = await getTotal();
        for(let i = 0; i < totalSongs + 1; i+= 20) {
            const options = {
                method: 'GET',
                url: `https://api.spotify.com/v1/me/tracks?limit=20&offset=${i}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            console.log(`calling with ${i}`)
            axios<SpotifyResponse>(options)
                .then(response => {
                    const likedSongs = response.data.items;
                    likedSongs.forEach(song => {
                        allSongs.push({"name": song.track.name, "artists": song.track.artists.map(artist => artist.name), "id": song.track.id, "album": song.track.album.name, "albumImage": song.track.album.images[0].url})
                    });
                });
            if(i % 500 == 0) {
                await delay(3000);
            }
        }
        return allSongs;
    }
    function findDuplicates(songs: Song[]) {
        const songsObject: SongsObject = {};
        const duplicateSongs: Song[] = [];
        songs.forEach(song => {
            if(songsObject[`${song.name}`]){
                songsObject[`${song.name}`] = [song.artists[0]]
            } else {
                const existingArtists = songsObject[`${song.name}`];
                if(existingArtists.includes(song.artists[0])) {
                    duplicateSongs.push({"name": song.name, "artists": song.artists, "id": song.id, "album": song.album, "albumImage": song.albumImage})
                } else {
                    songsObject[`${song.name}`].push(song.artists[0]);
                }
            }
        })
        return duplicateSongs;
    }
    try {
        const allSongs = await getAllSongs();
        const duplicateSongs = findDuplicates(allSongs);
        return {
            statusCode: 200,
            body: JSON.stringify({"allSongs": allSongs, "duplicateSongs": duplicateSongs})
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
};
