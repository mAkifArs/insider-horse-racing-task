import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { scan } from "react-scan";
import App from "./App.tsx";
import "./index.css";

// Enable react-scan in development mode only
if (import.meta.env.DEV) {
  scan({
    enabled: true,
    log: true, // logs render info to console
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
