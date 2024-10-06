import { useEffect, useState } from 'react';
import { Button, Typography, Container, Box, Table, TableContainer, Paper, TableHead, TableCell, TableRow, TableBody, Grid2 as Grid, Checkbox } from '@mui/material';

import axios from 'axios'
import { Song, songsResponse } from '../types';

function Dashboard() {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const scopes = "user-library-read user-library-modify";
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;

  const [hasToken, setHasToken] = useState<boolean>(localStorage.getItem('spotify_token') != null);
  const [songs, setSongs] = useState<Song[]>([]);  // State to store the songs
  const [duplicateSongs, setDuplicateSongs] = useState<Song[]>([]);  // State to store the songs
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);


  const handleLogin = () => {
    if (!hasToken) {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`;
    } else {
      localStorage.removeItem('spotify_token');
      setHasToken(false);
      console.log('set hasToken to false')
    }
  };

  const handleSelect = (song: Song) => {
    setSelectedSongs((selected) => {
      const isSelected = selected.some((selectedSong) => selectedSong.id === song.id);
  
      if (isSelected) {
        // If the song is already selected, filter it out
        return selected.filter((selectedSong) => selectedSong.id !== song.id);
      } else {
        // If the song is not selected, add it to the selection
        return [...selected, song];
      }
    });
  };
  
  console.log(selectedSongs);

  const handleDelete = () => {
    console.log('handling delete')
    if(hasToken){
      const token = localStorage.getItem('spotify_token') as string;

      const options = {
        method: 'DELETE',
        url: `https://dx1rj4m3g9.execute-api.us-east-1.amazonaws.com/Prod/songs?token=${token}`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
          selectedSongs
        }
      };
      return axios(options)
        .then(response => {
          console.log(response);
          getAllSongs(token);
        })
    }
  }

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

  useEffect(() => {
    console.log('render')
    const token = localStorage.getItem('spotify_token');
    if (token) {
      setHasToken(true);
      console.log('set hasToken to true');
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
        height: '90vh',
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
          color={hasToken ? 'primary' : 'secondary'}
          onClick={handleLogin}
        >
          {hasToken ? 'Logout' : 'Login'}
        </Button>
      </Box>
      <Box sx={{ textAlign: 'center', justifyContent: 'center', width: '100vw', maxWidth: '140%' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Spotify Songs
        </Typography>
        {hasToken ? (
          loading ? (
            <Typography variant="h6">Loading songs...</Typography>
          ) : (
            <Grid container spacing={2}>
              <Grid size={6} container alignItems="center" justifyContent="center">
                <Grid container alignItems="center" spacing={2}>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <Typography variant="h6" gutterBottom>
                      All Liked Songs
                    </Typography>
                  </Box>
                </Grid>
                <TableContainer component={Paper} sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell sx={{ position: 'sticky', top: 0, background: '#fff', height: "45px" }}>Song</TableCell>
                        <TableCell sx={{ position: 'sticky', top: 0, background: '#fff' }}>Artist</TableCell>
                        <TableCell sx={{ position: 'sticky', top: 0, background: '#fff' }}>Album</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {songs.map((song, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <img src={song.albumImage} alt={song.name} style={{ width: 50, height: 50 }} />
                          </TableCell>
                          <TableCell sx={{ height: '30px', overflowY: 'auto', whiteSpace: 'normal' }}>{song.name}</TableCell>
                          <TableCell sx={{ height: '30px', overflowY: 'auto', whiteSpace: 'normal' }}>{song.artists.join(", ")}</TableCell>
                          <TableCell sx={{ height: '30px', overflowY: 'auto', whiteSpace: 'normal' }}>{song.album}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid size={6} container alignItems="center" justifyContent="center" >
                <Grid container alignItems="center" spacing={2}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <Typography variant="h6" gutterBottom>
                        Duplicate Songs
                      </Typography>
                      <Button onClick={handleDelete} variant="contained" disabled={selectedSongs.length > 0 ? false : true} sx={{ borderRadius: "60px", background: "light-blue", marginLeft: 2 }}>
                        Delete
                      </Button>
                    </Box>
                </Grid>
                <TableContainer component={Paper} sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Checkbox 
                            checked={duplicateSongs.length > 0 && selectedSongs.length === duplicateSongs.length}
                            indeterminate={selectedSongs.length > 0 && selectedSongs.length < duplicateSongs.length}
                            onChange={() => {
                              if (selectedSongs.length === duplicateSongs.length) {
                                setSelectedSongs([]);
                              } else {
                                setSelectedSongs(duplicateSongs);
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ position: 'sticky', top: 0, background: '#fff', height: "45px" }}></TableCell>
                        <TableCell sx={{ position: 'sticky', top: 0, background: '#fff' }}>Song</TableCell>
                        <TableCell sx={{ position: 'sticky', top: 0, background: '#fff' }}>Artist</TableCell>
                        <TableCell sx={{ position: 'sticky', top: 0, background: '#fff' }}>Album</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {duplicateSongs.map((song, index) => (
                        <TableRow key={index} selected={selectedSongs.map(song => song.id).includes(song.id)}>
                          <TableCell>
                            <Checkbox checked={selectedSongs.map(song => song.id).includes(song.id)} onChange={() => handleSelect(song)} />
                          </TableCell>
                          <TableCell>
                            <img src={song.albumImage} alt={song.name} style={{ width: 50, height: 50 }} />
                          </TableCell>
                          <TableCell>{song.name}</TableCell>
                          <TableCell>{song.artists.join(", ")}</TableCell>
                          <TableCell>{song.album}</TableCell>
                          <TableCell></TableCell>
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