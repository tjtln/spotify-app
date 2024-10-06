import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios, { AxiosError } from 'axios';
import { Song } from './types';
import pLimit from 'p-limit';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const token = event.queryStringParameters?.token;
    const songs: Song[] = JSON.parse(event.body as string);
    console.log('songs:\n' + JSON.stringify(songs));
    console.log('body:\n' + event.body);
    const failedSongs: Song[] = [];
    const limit = pLimit(5);
    
    const requests = [];
    try {
        for(const song of songs){
            try {
                const response = await axios.delete(`https://api.spotify.com/v1/me/tracks?ids=${song.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            
                if (response.status === 200) {
                console.log(`${song} successfully removed from Liked Songs.`);
                } else {
                console.log(`Failed to remove ${song}.`);
                }
            } catch (error) {
                console.error(`Error removing ${song} from Liked Songs: `, error);
                failedSongs.push(song)
            }
        }
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify(`Songs failed to delete: ${JSON.stringify(failedSongs)}`)
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",

            },
            body: JSON.stringify(error)
        }
    }
}
