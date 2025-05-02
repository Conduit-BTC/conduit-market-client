import "@/styles/index.css";
import React from "react"; // Add this import
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
