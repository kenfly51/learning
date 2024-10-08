// MiniApp.ts
import { IMiniApp } from '@core/types/IMiniApp';
import { IEventBus } from '@core/types/IEventBus';

export abstract class MiniApp extends HTMLElement implements IMiniApp {
  protected eventBus: IEventBus;

  constructor(eventBus: IEventBus) {
    super();
    this.eventBus = eventBus;
  }

  abstract initialize(): void;

  communicate(data: any): void {
    this.eventBus.emit('miniapp-message', data);
  }

  protected listen(event: string, callback: (data: any) => void): void {
    this.eventBus.on(event, callback);
  }
}
