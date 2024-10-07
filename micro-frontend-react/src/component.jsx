import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

class ReactMicroFrontend extends HTMLElement {
  constructor() {
    super();
    this.root = createRoot(this);
  }
  connectedCallback() {
    this.root.render(<App />);
  }

  disconnectedCallback() {
    this.root.unmount();
  }
}

// Register the Web Component
customElements.define("react-micro-frontend", ReactMicroFrontend);
