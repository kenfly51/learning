import { MiniApp } from './MiniApp';
import { IEventBus } from '@core/types/IEventBus';

export class MiniAppFactory {
  static register<T extends MiniApp>(tagName: string, miniAppClass: new (eventBus: IEventBus) => T): void {
    customElements.define(tagName, miniAppClass);
  }

  static createMiniApp<T extends MiniApp>(tagName: string, cssContent: string, eventBus: IEventBus): T | undefined {
    const miniAppClass = customElements.get(tagName);
    if (miniAppClass) {
      return new (miniAppClass as new (cssContent: string, eventBus: IEventBus) => T)(cssContent, eventBus);
    }
  }
}