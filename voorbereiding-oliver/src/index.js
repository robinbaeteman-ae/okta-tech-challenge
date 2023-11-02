import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
    domain="labs-part1-oliverae.eu.auth0.com"
    clientId="CB490AHMpv5KDsxxlXneRQs9pxrthkl3"
    authorizationParams={{
      redirect_uri: window.location.origin,
      scope:'openid profile email read:notes',
      audience:'https://notes',
    }}
    // scope='openid profile email read:notes'
    // audience='https://notes'
  >
    <App />
  </Auth0Provider>
);
