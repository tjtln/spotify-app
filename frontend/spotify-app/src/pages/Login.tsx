function Login() {
    const clientId = "549290679547443d91f55b8dcec011bf";
    const scopes = "user-library-read user-library-modify";
    const redirectUri = "http://localhost:5173/callback";
    const handleLogin = () => {
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`;
    }
    return (
        <button onClick={handleLogin}> Login with Spotify </button>
    )
}
export default Login
