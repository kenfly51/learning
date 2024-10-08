// EventBus.ts
import { IEventBus } from '@core/types/IEventBus';

export class EventBus implements IEventBus {
  private listeners: { [key: string]: ((data: any) => void)[] } = {};

  emit(event: string, data: any): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }
}
