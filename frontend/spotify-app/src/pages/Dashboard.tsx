import { useEffect, useState } from 'react';
import { Button, Typography, Container, Box, Table, TableContainer, Paper, TableHead, TableCell, TableRow, TableBody, Grid2 as Grid } from '@mui/material';

import axios from 'axios'
import { Song, songsResponse } from '../types';

function Dashboard() {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const scopes = "user-library-read user-library-modify";
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  
  const handleLogin = () => {
    if (!hasToken) {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`;
    } else {
      localStorage.removeItem('spotify_token');
      setHasToken(false);
    }
  };

  async function getAllSongs(token: string): Promise<songsResponse> {
    const options = {
      method: 'GET',
      url: `https://dx1rj4m3g9.execute-api.us-east-1.amazonaws.com/Prod/songs?token=${token}`,
      headers: {
          'Content-Type': 'application/json'
      }
  };
  return axios(options)
      .then(response => {
          return response.data;
      })
      .catch(error => {
          console.error('Error fetching liked songs:', error.response ? error.response.data : error.message);
      });
  }

  const [hasToken, setHasToken] = useState<boolean>(localStorage.getItem('spotify_token') != null);
  const [songs, setSongs] = useState<Song[]>([]);  // State to store the songs
  const [duplicateSongs, setDuplicateSongs] = useState<Song[]>([]);  // State to store the songs

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (token) {
      setHasToken(true);
      setLoading(true);  // Start loading state
      getAllSongs(token).then(response => {
        setSongs(response.allSongs);  // Update songs state
        setDuplicateSongs(response.duplicateSongs);  // Update songs state
        setLoading(false);  // End loading state
      });
    }
  }, [hasToken]);

  return (
    <Container
      sx={{
        textAlign: 'center',
        mt: 4,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 0,
          width: '100vw',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          sx={{ marginRight: 16 }}
          variant="contained"
          color={hasToken ? 'secondary' : 'primary'}
          onClick={handleLogin}
        >
          {hasToken ? 'Logout' : 'Login'}
        </Button>
      </Box>
      <Box sx={{ textAlign: 'center', justifyContent: 'center', width: '100vw', maxWidth: '140%'}}>
        <Typography variant="h4" component="h1" gutterBottom>
          Spotify Songs
        </Typography>
        {hasToken ? (
          loading ? ( 
            <Typography variant="h6">Loading songs...</Typography>
          ) : (
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="h6" gutterBottom>
                  All Liked Songs
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Song</TableCell>
                        <TableCell>Artist</TableCell>
                        <TableCell>Album</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {songs.map((song, index) => (
                        <TableRow key={index}>
                          <img src={song.albumImage} alt={song.name} style={{width: 50, height: 50 }}/>
                          <TableCell sx={{height: '30px', overflowY: 'auto', whiteSpace: 'normal'}}>{song.name}</TableCell>
                          <TableCell sx={{height: '30px', overflowY: 'auto', whiteSpace: 'normal'}}>{song.artists.join(", ")}</TableCell>
                          <TableCell sx={{height: '30px', overflowY: 'auto', whiteSpace: 'normal'}}>{song.album}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid size={6}>
                <Typography variant="h6" gutterBottom>
                  Duplicate Songs
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Song</TableCell>
                        <TableCell>Artist</TableCell>
                        <TableCell>Album</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {duplicateSongs.map((song, index) => (
                        <TableRow key={index}>
                          <img src={song.albumImage} alt={song.name} style={{ width: 50, height: 50 }}/>
                          <TableCell>{song.name}</TableCell>
                          <TableCell>{song.artists.join(", ")}</TableCell>
                          <TableCell>{song.album}</TableCell>
                          <TableCell>
                          <Button 
                            sx={{ 
                              minWidth: 'auto', 
                              padding: '5px 10px', 
                              fontSize: '0.8rem', 
                              color: 'white', 
                              background: '#ff1744',
                              borderColor: '#ff1744',
                              borderRadius: '20px'
                            }} 
                          >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )
        ) : (
          <Typography variant="h6" component="h3">
            No token available. Please log in.
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default Dashboard;
