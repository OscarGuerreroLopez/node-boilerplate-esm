import { v4 as uuidv4, validate as isValidUUID } from 'uuid';
import { type DomainEvent } from '../events/domain.event';

export abstract class Entity<T> {
  readonly entityId: string;
  protected props: T;
  private domainEvents: DomainEvent[] = [];

  constructor(props: T, entityId?: string) {
    if (entityId != null && !isValidUUID(entityId)) {
      throw new Error('Invalid entity ID format');
    }
    this.entityId = entityId ?? uuidv4();
    this.props = props; // Ensure immutability
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

  public equals(object?: Entity<T>): boolean {
    return object instanceof Entity && this.entityId === object.entityId;
  }

  public getProps(): Readonly<T> {
    return Object.freeze({ ...this.props });
  }
}
