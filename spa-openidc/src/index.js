import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
      domain="challenge-ae.eu.auth0.com"
      clientId="BOtRAesqhWw65hvNaQm72ImdxYinSEWx"
      authorizationParams={{
        redirect_uri: "http://localhost:3000",
        returnTo: "http://localhost:3000"
      }}
    >
    <React.StrictMode>
      <App />
    </React.StrictMode>,

  </Auth0Provider>
);
