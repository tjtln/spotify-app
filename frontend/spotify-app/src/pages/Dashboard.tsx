import { useEffect, useState } from 'react';
import { Button, Typography, Container, Box } from '@mui/material';

function Dashboard() {
  const clientId = "549290679547443d91f55b8dcec011bf";
  const scopes = "user-library-read user-library-modify";
  const redirectUri = "http://localhost:5173/callback";
  
  const handleLogin = () => {
    if (!hasToken) {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`;
    } else {
      localStorage.removeItem('spotify_token');
      setHasToken(false);
    }
  };

  const [hasToken, setHasToken] = useState<boolean>(localStorage.getItem('spotify_token') != null);

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    setHasToken(!!token);
  }, []);

  return (
    <Container
      sx={{
        textAlign: 'center',
        mt: 4,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', // Make this position relative
        height: '100vh', // Full height of the viewport
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 16, // Distance from the top
          left: 0, // Start from the left side of the screen
          width: '100vw', // Full width of the viewport
          display: 'flex', // Use flexbox to position the button
          justifyContent: 'flex-end', // Push the button to the right
          paddingRight: 1600, // Optional padding from the right edge
        }}
      >
        <Button
          sx={{marginRight: 16}}
          variant="contained"
          color={hasToken ? 'secondary' : 'primary'}
          onClick={handleLogin}
        >
          {hasToken ? 'Logout' : 'Login'}
        </Button>
      </Box>
      <Box sx={{textAlign: 'center', justifyContent: 'center', width: '100vw'}}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        {hasToken ? (
        <Typography variant="h6" component="h3">
          Spotify Songs
        </Typography>
      ) : (
        <Typography variant="body1" color="textSecondary">
          Please log in to manage your songs.
        </Typography>
      )}
      </Box>
    </Container>
  );
}

export default Dashboard;
