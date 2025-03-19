import { v4 as uuidv4, validate as isValidUUID } from 'uuid';
import { type DomainEvent } from '../events/domain.event';

export abstract class AggregateRoot<T> {
  readonly aggregateId: string;
  protected readonly props: Readonly<T>;
  private domainEvents: DomainEvent[] = [];

  constructor(props: T, aggregateId?: string) {
    if (aggregateId != null && !isValidUUID(aggregateId)) {
      throw new Error('Invalid aggregate ID format');
    }
    this.aggregateId = aggregateId ?? uuidv4();
    this.props = Object.freeze(props); // Ensure immutability
  }

  /** 📌 Add a new domain event */
  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  /** 📌 Retrieve all events */
  public getDomainEvents(): DomainEvent[] {
    return this.domainEvents;
  }

  /** 📌 Clear events after dispatching them */
  public clearDomainEvents(): void {
    this.domainEvents = [];
  }

  public equals(object?: AggregateRoot<T>): boolean {
    return object instanceof AggregateRoot && this.aggregateId === object.aggregateId;
  }

  public getProps(): Readonly<T> {
    return Object.freeze({ ...this.props });
  }
}
