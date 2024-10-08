import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

// Define the dynamic Web Component loader
class DynamicComponentLoader extends HTMLElement {
  static get observedAttributes() {
    return ["tag-name", "src", "style-url"];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  // This function dynamically loads a script
  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (!src) {
        // reject(new Error("No script URL provided"));
        return;
      }
      console.log("load", src);
      const script = document.createElement("script");
      script.src = src;
      script.type = "module"; // This is important to support ES Module format (Vite uses ES modules)
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  async fetchAndEmbedCSS(styleUrl, container) {
    try {
      const response = await fetch(styleUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const cssContent = await response.text();

      // Prepend the container ID to each CSS rule for isolation
      const scopedCSSContent = `
        #${container.id} {
          ${cssContent}
        }
      `;

      const styleElement = document.createElement("style");
      styleElement.textContent = scopedCSSContent;

      container.appendChild(styleElement);
    } catch (error) {
      console.error("Failed to load CSS:", error);
    }
  }

  async attributeChangedCallback(attrName, oldVal, newVal) {
    console.log("Attribute changed:", attrName, newVal); // Debugging line

    // Check if both tag-name and src are set
    const tagName = this.getAttribute("tag-name");
    const scriptUrl = this.getAttribute("src");
    const styleUrl = this.getAttribute("style-url");

    if (tagName && scriptUrl && styleUrl) {
      await this.loadComponent(tagName, scriptUrl, styleUrl);
    }
  }

  async loadComponent(tagName, scriptUrl, styleUrl) {
    this.shadow.innerHTML = ""; // Clear previous content

    const container = document.createElement("div");
    const containerId = `micro-frontend-${tagName}`;
    container.setAttribute("id", containerId);

    if (styleUrl) {
      await this.fetchAndEmbedCSS(styleUrl, container);
    }

    // Dynamically load the external micro-frontend script
    await this.loadScript(scriptUrl);

    // Create the custom element after the script has loaded
    const component = document.createElement(tagName);
    container.appendChild(component);

    this.shadow.appendChild(container);
  }
}

// Register the loader Web Component
customElements.define("dynamic-component-loader", DynamicComponentLoader);

const App = () => {
  const [microFrontends, setMicroFrontends] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Fetch the micro-frontend metadata from a remote source
    async function fetchMicroFrontends() {
      const response = await fetch("/sites.json");
      const data = await response.json();
      setMicroFrontends(data.microfrontends);
    }
    fetchMicroFrontends();
  }, []);

  useEffect(() => {
    // Listen for messages from micro-frontend 1 and forward them to micro-frontend 2
    window.eventBus.on("message-from-micro-frontend-1", (message) => {
      console.log("Shell received message from Micro-frontend 1:", message);

      // Forward the message to Micro-frontend 2
      window.eventBus.emit("message-to-micro-frontend-2", message);
    });

    return () => {
      // Cleanup event listener
      window.eventBus.off("message-from-micro-frontend-1");
    };
  }, []);

  return (
    <div className="App">
      <h1>Shell: Micro-Frontend Loader</h1>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {microFrontends.map((mf, index) => (
        <dynamic-component-loader
          key={index}
          tag-name={mf.tagName}
          src={mf.scriptUrl}
          style-url={mf.styleUrl}
        ></dynamic-component-loader>
      ))}
    </div>
  );
};

export default App;
