import { v4 as uuidv4, validate as isValidUUID } from 'uuid';
import { type DomainEvent } from '../events/domain.event';

export abstract class AggregateRoot<T> {
  readonly entityId: string;
  protected readonly props: Readonly<T>;
  private domainEvents: DomainEvent[] = [];

  constructor(props: T, entityId?: string) {
    if (entityId != null && !isValidUUID(entityId)) {
      throw new Error('Invalid aggregate ID format');
    }
    this.entityId = entityId ?? uuidv4();
    this.props = Object.freeze(props);
  }

  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  public getDomainEvents(): DomainEvent[] {
    return this.domainEvents;
  }

  public clearDomainEvents(): void {
    this.domainEvents = [];
  }

  public equals(object?: AggregateRoot<T>): boolean {
    return object instanceof AggregateRoot && this.entityId === object.entityId;
  }

  public getProps(): Readonly<T> {
    return Object.freeze({ ...this.props });
  }
}
