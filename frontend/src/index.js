import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement); // Ensure the rootElement is correctly initialized

root.render(
  <StrictMode>
    <BrowserRouter>
      {" "}
      {/* Wrap App inside BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
