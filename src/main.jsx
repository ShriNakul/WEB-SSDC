// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
// We import BrowserRouter here to wrap the entire App
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* This is the ONE main Router allowed in your app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
