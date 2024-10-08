// MiniApp.ts
import { IMiniApp } from '@core/types/IMiniApp';
import { IEventBus } from '@core/types/IEventBus';

export abstract class MiniApp extends HTMLElement implements IMiniApp {
  protected eventBus: IEventBus;
  private cssContent: string;

  constructor(cssContent: string, eventBus: IEventBus) {
    super();
    this.eventBus = eventBus;
    this.cssContent = cssContent;
    // Attach shadow DOM in 'open' mode so that styles and structure are isolated
    this.attachShadow({ mode: 'open' });
  }

  abstract initialize(): void;

  protected abstract render(mountPoint: HTMLElement): void;

  connectedCallback() {
    this.attachCssStyle();
    this.createAndAttachDOM();
  }

  // Method to handle the logic for creating and attaching DOM to the shadow DOM
  private createAndAttachDOM(): void {
    if (this.shadowRoot) {
      const mountPoint = document.createElement('div');
      this.shadowRoot.appendChild(mountPoint);
      this.render(mountPoint); // Call the abstract render method with the mount point
    }
  }

  private attachCssStyle(): void {
    const styleElement = document.createElement("style");
    styleElement.textContent = this.cssContent;

    this.shadowRoot?.prepend(styleElement);
  }

  communicate(data: any): void {
    this.eventBus.emit('miniapp-message', data);
  }

  protected listen(event: string, callback: (data: any) => void): void {
    this.eventBus.on(event, callback);
  }
}