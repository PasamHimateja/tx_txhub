import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./index.css";

import { BrowserRouter } from "react-router-dom";

import { CartProvider } from "./context/CartContext";

import { AuthProvider } from "./context/AuthContext";

import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
  // Suppressed console error as per user request
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>

);
