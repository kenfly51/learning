import { useEffect, useRef } from "react";
import { EventBus, Shell } from "@noodle/atomkit";

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
  const ref = useRef();

  useEffect(() => {
    const loadApps = async () => {
      const eventBus = new EventBus();

      const shell = new Shell(eventBus);

      const currentApp = await shell.loadMiniApp(
        "react-micro-frontend",
        "http://localhost:4173/react-micro-frontend.js",
        "http://localhost:4173/style.css"
      );

      ref.current.appendChild(currentApp);
    };

    loadApps();
  }, []);

  return (
    <div className="App">
      <h1>Shell: Micro-Frontend Loader</h1>
      <div className="mini-app" ref={ref} />
    </div>
  );
};

export default App;
