import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

// ✅ Match Vyan-Security logic
const isGithub = window.location.hostname.includes("github.io");
const basename = isGithub ? "/DocSlayer" : "/";

root.render(
  // <BrowserRouter basename={basename}>
  //   <App />
  // </BrowserRouter>
  <App />
);
