// import logo from './logo.svg';
import './App.css';
import LoginButton from './components/login';
import LogoutButton from './components/logout';
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from 'react';

function App() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently} = useAuth0();
  const [notes, setNotes] = useState([]);

  useEffect(()=>{
      // get token
      if(isAuthenticated){
        getAccessTokenSilently().then(claims => {
            console.log(claims);
            const headers = {
              Authorization: `Bearer ${claims}`,
            };
            // fetch data
            fetch('http://localhost:5000/api/sensitive-data/0', {headers})
            .then((response) => response.json())
            .then((data) => {
              setNotes(data); 
              console.log(data)});
          })
        }
  
  }, [isAuthenticated])
  

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if(!isAuthenticated){
    return <LoginButton/>
  }

  return (
    isAuthenticated && (
      <div>
        <LogoutButton/>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.sub}</p>
        <p>{user.email}</p>
        <p>{user.updated_at}</p>
        <div>
          <h2>Notes:</h2>
          <ul>
            {notes.map((note) => (
              <li key={note.id}>{note.text}</li>
            ))}
          </ul>
        </div>

      </div>
    )
  );
}

export default App;
