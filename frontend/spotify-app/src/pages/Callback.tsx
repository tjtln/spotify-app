import { useEffect, useState } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
function Callback() {
    const navigate = useNavigate();
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const [hasToken, setHasToken] = useState(false);
    useEffect(() => {
        if(!hasToken){
            const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const basicAuth = btoa(`${clientId}:${clientSecret}`);
            const getToken = async (code: string) => {
                try {
                    await axios.post('https://accounts.spotify.com/api/token', 
                        {
                            grant_type: 'authorization_code',
                            code: code,
                            redirect_uri: redirectUri
                        },
                        {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': `Basic ${basicAuth}`,
                        },
                    }).then((response) => {
                        console.log(response.data);
                        console.log('here')
                        localStorage.setItem('spotify_token', response.data?.access_token);
                        setHasToken(response.data?.access_token);
                    });
                } catch (err) {
                    console.log(err);
                }
            }
            if(code){
                getToken(code);
            } else {
                console.error('no code found');
                navigate('/');
            }
        } else {
            navigate("/")
        }

    }, [clientId, clientSecret, navigate, redirectUri, hasToken]);

    return (
        <div>
            <p>
                Retrieving Token...
            </p>
        </div>
    )
}
export default Callback
