import './App.css';

import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

function App() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccesToken] = useState();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if(!isAuthenticated){
    return <LoginButton/>
  }

  getAccessTokenSilently().then(data => setAccesToken(data));

  return (
    !isLoading && 
    <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>{JSON.stringify(user)}</p>
        {user["notes-app/roles"].includes("Admin") && <p>You're an admin</p>}
        {user["notes-app/roles"].includes("Challenger") && <p>You're an admin</p>}
      </div>
  );
}

export default App;
