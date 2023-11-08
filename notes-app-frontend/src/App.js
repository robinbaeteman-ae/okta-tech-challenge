import './App.css';

import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {Grid, Paper, TextField, Button} from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define your custom theme
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#ffa500', // Change the primary color to orange
    },
    secondary: {
      main: '#ffa500', // Change the secondary color to blue
    },
  },
});

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <Button onClick={() => loginWithRedirect()}>Log In</Button>;
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return <Button variant="contained"
          color="primary"
          style={{ position: 'absolute', top: '10px', right: '10px', color: "white"}}
          onClick={() => logout()}>
            Log out 
        </Button>;
};

function App() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [accesstoken, setaccesstoken] = useState();
  const [notes, setNotes] = useState(['Note 1','Note 2', 'Note 3',]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const initAuth0 = async () => {
      if(isAuthenticated){
        const token = await getAccessTokenSilently();
        setaccesstoken(token);
      }
    }
    
    initAuth0();
    console.log(accesstoken);
  }
  , [user]);

  // api endpoints
  useEffect(() => {

    const apiUrl = "http://localhost:5000/api/notes"

    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accesstoken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.log('Network response was not ok');
        }
        return response.json(); 
      })
      .then((data) => {
        setNotes(data.map((item) => item.text)); 
      })
      .catch((error) => {
        console.log(error)
      });
  }, []); 

  const postNote = async (note) => {
    const response = await fetch(`http://localhost:5000/api/notes`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({"text":note}),
  });

  };


  // change handlers
  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  const handleAddNote = () => {
    if (newNote.trim() !== '') {
      setNotes([...notes, newNote]);
      // try{
      //  postNote(newNote).then(data => console.log(data));
      // }
      // catch(error){
      //   console.log(error)
      // }
      setNewNote('');
    }
  };

  const paperStyle = {
    backgroundColor: 'orange', // Set the background color to orange
    color: 'white', // Set the text color to white
    padding: '16px', // Add padding for spacing
    textAlign: 'center', // Center align content
    height: '100vh', // Set the height to 100% of the viewport height
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const whitePaperStyle = {
    backgroundColor: 'white', // Set the background color to white
    color: 'black', // Set the text color to black
    padding: '16px', // Add padding for spacing
    height: '100vh'
  };

  
  if(!isAuthenticated){
    return <LoginButton/>
  }

  if (isLoading) {
    return <div>Loading ...</div>;
  }




  return (
    !isLoading && 
    <ThemeProvider theme={customTheme}>
      <LogoutButton/>
      <Grid container>
        <Grid item xs={3}>
          <Paper style={paperStyle}>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            {user["notes-app/roles"].includes("Admin") && <p>You're an admin</p>}
            {user["notes-app/roles"].includes("Challenger") && <p>You're a challenger</p>}
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper style={whitePaperStyle}>
          <h2>Notes List</h2>
            <ul>
              {notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
            <TextField
              label="Add a note"
              variant="outlined"
              value={newNote}
              onChange={handleNoteChange}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleAddNote} fullWidth style={{color: "white"}}>
              Add Note
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
