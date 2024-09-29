import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import { SpotifyResponse, Song, SongsObject} from './types';
import pLimit from 'p-limit';

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
            }).catch(error => {
                console.error('Error fetching liked songs:', error.response ? error.response.data : error.message);
            });
    }
    async function getAllSongs() {
        const allSongs: Song[] = [];
        const totalSongs = await getTotal() as number;
        const limit = pLimit(5);
    
        const requests = [];
        for (let i = 0; i < totalSongs; i += 20) {
            requests.push(limit(async () => {
                const options = {
                    method: 'GET',
                    url: `https://api.spotify.com/v1/me/tracks?limit=20&offset=${i}`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                };
                console.log(`calling with ${i}`);
                const response = await axios<SpotifyResponse>(options);
                const likedSongs = response.data.items;
                likedSongs.forEach(song => {
                    allSongs.push({
                        "name": song.track.name,
                        "artists": song.track.artists.map(artist => artist.name),
                        "id": song.track.id,
                        "album": song.track.album.name,
                        "albumImage": song.track.album.images[0]?.url
                    });
                });
            }));
        }
    
        await Promise.all(requests);
        return allSongs;
    }
    function findDuplicates(songs: Song[]) {
        const songsObject: SongsObject = {};
        const duplicateSongs: Song[] = [];
        songs.forEach(song => {
            if(!songsObject[`${song.name}`]){
                songsObject[`${song.name}`] = [song.artists[0]];
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
        await delay(3000)
        const duplicateSongs = findDuplicates(allSongs);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({"allSongs": allSongs, "duplicateSongs": duplicateSongs})
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify(error)
        }
    }
};
