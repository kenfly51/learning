import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

createApp(App).mount("#app");

class VueMicroFrontend extends HTMLElement {
  connectedCallback() {
    const app = createApp(App);
    app.mount(this);
  }

  disconnectedCallback() {
    // Vue cleanup logic if needed
  }
}

// Register the Web Component
customElements.define("vue-micro-frontend", VueMicroFrontend);
