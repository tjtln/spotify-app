import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import { SpotifyResponse, DuplicateSongs, Songs} from './types';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const songs: Songs = [];
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const token = event.queryStringParameters?.token;
    const accessToken = token;
    async function getSongs(){
        async function getTotal(): Promise<number>{
            const options = {
                method: 'GET',
                url: `https://api.spotify.com/v1/me/tracks?limit=1&offset=0`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            return axios(options)
                .then(response => {
                    return response.data.total;
                })
                .catch(error => {
                    console.error('Error fetching liked songs:', error.response ? error.response.data : error.message);
                });
        }
        const total = await getTotal();
        console.log(`found ${total} liked songs`);
        for(let i = 0; i < total + 1; i+= 20) {
            const options = {
                method: 'GET',
                url: `https://api.spotify.com/v1/me/tracks?limit=20&offset=${i}`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            console.log(`calling with ${i}`)
            axios<SpotifyResponse>(options) //wip
                .then(response => {
                    const likedSongs = response.data.items;
                    likedSongs.forEach(song => {
                        songs.push({"name": song.track.name, "artist": song.track.artists[0].id, "id": song.track.id})
                    });
                })
                .catch(error => {
                    console.error('Error fetching liked songs:', error.response ? error.response.data : error.message);
                });
            if(i % 500 == 0) {
                await delay(3000);
            }
        }
    }
    try {
    await getSongs();
    await delay(1000)
    const values = {};
    let count = 0;
    const duplicateSongs: Songs = {};
    songs.forEach(song => {
        const name = song.name;
        const artist = song.artist
        const id = song.id;
        if (!values[`${name}`]) {
            values[`${name}`] = [artist];
        } else {
            const existingArtists = values[`${name}`];
            if(existingArtists.includes(song.artist)) {
                duplicateSongs[`${id}`] = {"name": name, "artist": artist};
                count++;
            } else {
                values[`${name}`].push(artist);
            }
        }
    });
    console.log(count + ' duplicate songs found');
    return {
        statusCode: 200,
        body: JSON.stringify(duplicateSongs),
    };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
