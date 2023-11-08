import './App.css';
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Log Out
    </button>
  );
};

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
    <div className="App">
      <p>SPA - using SAML</p>
      <LoginButton/>
      <LogoutButton/>
      <p></p>
      {isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
      )}
    </div>
  );
}

export default App;
