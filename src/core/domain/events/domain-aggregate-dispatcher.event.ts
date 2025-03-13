/* eslint-disable @typescript-eslint/no-extraneous-class */
import { type AggregateDomainEvent } from './aggregate-domain.event';

type EventHandler<T extends AggregateDomainEvent> = (event: T) => void;

export class DomainAggregateEventDispatcher {
  private static readonly handlers = new Map<string, Array<EventHandler<AggregateDomainEvent>>>();

  /** 📌 Register a listener for an event */
  static register<T extends AggregateDomainEvent>(eventType: new (...args: any[]) => T, handler: EventHandler<T>): void {
    const eventName = eventType.name;

    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }

    this.handlers.get(eventName)?.push(handler as EventHandler<AggregateDomainEvent>);
  }

  /** 📌 Dispatch an event */
  static dispatch(event: AggregateDomainEvent): void {
    const eventName = event.constructor.name;
    const handlers = this.handlers.get(eventName) ?? [];

    for (const handler of handlers) {
      handler(event);
    }
  }
}
