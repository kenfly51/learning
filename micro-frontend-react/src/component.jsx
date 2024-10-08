import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { MiniApp, MiniAppFactory } from "@noodle/atomkit";

class MyMiniApp extends MiniApp {
  initialize() {
    console.log("MyMiniApp Initialized");
    this.listen("miniapp-message", (data) => {
      console.log("Received in MyMiniApp:", data);
    });
  }

  render(container) {
    const root = createRoot(container);
    root.render(<App miniApp={this} />);
    console.log("rendered");
  }
}

// Register the Web Component
MiniAppFactory.register("react-micro-frontend", MyMiniApp);
