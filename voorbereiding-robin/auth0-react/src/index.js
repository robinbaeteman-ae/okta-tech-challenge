import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain="auth0challenge-ae.eu.auth0.com"
    clientId="cEEAkQcTovCEpO9sa5mN2aTtH3bPaSpy"
    authorizationParams={{
      redirect_uri: window.location.origin + "/profile",
      audience: "http://127.0.0.1:5000",
      scope: "read:current_user update:current_user_metadata"
    }}>
    <App />
  </Auth0Provider>
);