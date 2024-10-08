import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { MiniApp, MiniAppFactory } from "@noodle/atomkit";

class ReactMicroFrontend extends MiniApp {
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

  initialize() {
    console.log("init mini app");
  }
}

// Register the Web Component
MiniAppFactory.register("react-micro-frontend", ReactMicroFrontend);
