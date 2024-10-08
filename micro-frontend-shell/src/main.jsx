import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { eventBus } from "./utils/eventBus";

// Expose eventBus on the window object for microsites
window.eventBus = eventBus;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
