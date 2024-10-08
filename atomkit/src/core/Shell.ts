import { IShell } from '@core/types/IShell';
import { IEventBus } from '@core/types/IEventBus';
import { MiniAppFactory } from './MiniAppFactory';
import { MiniApp } from './MiniApp';

export class Shell implements IShell {
  private eventBus: IEventBus;

  constructor(eventBus: IEventBus) {
    this.eventBus = eventBus;
  }

  async loadMiniApp(tagName: string, scriptUrl: string, cssUrl?: string): Promise<MiniApp | undefined> {
    return new Promise(async (resolve, reject) => {
      let cssContent: string;
      const script = document.createElement('script');
      script.src = scriptUrl;

      if (cssUrl) {
        try {
          const response = await fetch(cssUrl);
          if (response.ok) {
            cssContent = await response.text();
          }
        } catch (e) {
          console.error(e)
        }
      }

      script.onload = () => {
        const miniAppInstance = MiniAppFactory.createMiniApp(tagName, cssContent, this.eventBus);
        if (miniAppInstance) {
          miniAppInstance?.initialize();
          resolve(miniAppInstance);
        } else {
          reject(`mini ${tagName} does not exist`)
        }
      };

      document.head.appendChild(script);
    })
  }

  communicateBetweenMiniApps(event: string, data: any): void {
    this.eventBus.emit(event, data);
  }
}