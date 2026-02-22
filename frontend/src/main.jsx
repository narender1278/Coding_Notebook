import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store/store";
import 'primereact/resources/themes/lara-light-blue/theme.css';  // theme
import 'primereact/resources/primereact.min.css';                // core styles
import 'primeicons/primeicons.css';
// import { Auth0Provider } from "@auth0/auth0-react";

// const domain = import.meta.env.VITE_AUTH0_DOMAIN;
// const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

// // Validate Auth0 configuration
// if (!domain || !clientId) {
//   console.error("Auth0 configuration missing. Please check your .env file.");
//   console.error("Required environment variables:");
//   console.error("- VITE_AUTH0_DOMAIN");
//   console.error("- VITE_AUTH0_CLIENT_ID");
//   throw new Error("Auth0 domain and client ID must be set in .env file");
// }

// // Validate domain format
// if (!domain.includes('.auth0.com') && !domain.includes('.us.auth0.com') && !domain.includes('.eu.auth0.com') && !domain.includes('.au.auth0.com')) {
//   console.warn("Auth0 domain format might be incorrect. Expected format: your-domain.auth0.com");
// }

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <BrowserRouter >
      <App />
      <Toaster />
    </BrowserRouter>
    </Provider>
  // </StrictMode>,
)