import './App.css';
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = (isAuthenticated) => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()} disabled={isAuthenticated}>Log In</button>;
};

const LogoutButton = (isAuthenticated) => {
  const { logout } = useAuth0();

  return (
    <button 
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      disabled={!isAuthenticated}>
      Log Out
    </button>
  );
};

function App() {
  const { user, isAuthenticated} = useAuth0();
  const lob = LogoutButton(isAuthenticated);
  const lib = LoginButton(isAuthenticated);

  return (
    <div className="App">
      <h1>LodonSpots</h1>
      <p>SPA (React) - with OpenIDC tokens</p>
      {lib}
      {lob}
      <div style={{height:"100px"}}></div>
      {isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
      )}

      {isAuthenticated && user["organization"] === "microsoft" && <p><b>You are from the MS organization. Only MS users can see this.</b></p>}
      

    </div>
  );
}

export default App;
