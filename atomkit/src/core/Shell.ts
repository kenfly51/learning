import { IShell } from '@core/types/IShell';
import { IEventBus } from '@core/types/IEventBus';
import { MiniAppFactory } from './MiniAppFactory';

export class Shell implements IShell {
  private eventBus: IEventBus;

  constructor(eventBus: IEventBus) {
    this.eventBus = eventBus;
  }

  loadMiniApp(tagName: string, scriptUrl: string, cssUrl?: string): void {
    const script = document.createElement('script');
    script.src = scriptUrl;

    if (cssUrl) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssUrl;
      document.head.appendChild(link);
    }

    script.onload = () => {
      const miniAppInstance = MiniAppFactory.createMiniApp(tagName, this.eventBus);
      if (miniAppInstance) {
        miniAppInstance?.initialize();
        document.body.appendChild(miniAppInstance);
      } else {
        console.warn(`mini${tagName}does not exist`)
      }
    };

    document.head.appendChild(script);
  }

  communicateBetweenMiniApps(event: string, data: any): void {
    this.eventBus.emit(event, data);
  }
}