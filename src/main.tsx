import React from "react";
import { createRoot } from "react-dom/client";
import "./assets/styles/reset.css";
import "./assets/styles/normalize.css";
import "./assets/styles/index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
