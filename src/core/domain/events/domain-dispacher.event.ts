/* eslint-disable @typescript-eslint/no-extraneous-class */
import { type BaseDomainEvent } from './base-domain.event';

type EventHandler<T extends BaseDomainEvent> = (event: T) => void;

export class DomainEventDispatcher {
  private static readonly handlers = new Map<string, Array<EventHandler<BaseDomainEvent>>>();

  /** 📌 Register a listener for an event */
  static register<T extends BaseDomainEvent>(eventType: new (...args: any[]) => T, handler: EventHandler<T>): void {
    const eventName = eventType.name;

    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }

    this.handlers.get(eventName)?.push(handler as EventHandler<BaseDomainEvent>);
  }

  /** 📌 Dispatch an event */
  static dispatch(event: BaseDomainEvent): void {
    const eventName = event.constructor.name;
    const handlers = this.handlers.get(eventName) ?? [];

    for (const handler of handlers) {
      handler(event);
    }
  }
}
