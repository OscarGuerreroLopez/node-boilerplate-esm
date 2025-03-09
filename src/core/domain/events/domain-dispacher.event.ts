/* eslint-disable @typescript-eslint/no-extraneous-class */
import { type DomainEvent } from './domain.event';

type EventHandler<T extends DomainEvent> = (event: T) => void;

export class DomainEventDispatcher {
  private static readonly handlers = new Map<string, Array<EventHandler<DomainEvent>>>();

  /** 📌 Register a listener for an event */
  static register<T extends DomainEvent>(eventType: new (...args: any[]) => T, handler: EventHandler<T>): void {
    const eventName = eventType.name;

    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }

    this.handlers.get(eventName)?.push(handler as EventHandler<DomainEvent>);
  }

  /** 📌 Dispatch an event */
  static dispatch(event: DomainEvent): void {
    const eventName = event.constructor.name;
    const handlers = this.handlers.get(eventName) ?? [];

    for (const handler of handlers) {
      handler(event);
    }
  }
}
