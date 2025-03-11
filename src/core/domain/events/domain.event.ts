export abstract class DomainEvent {
  readonly occurredAt: Date;
  readonly entityId: string;

  constructor(entityId: string) {
    this.occurredAt = new Date();
    this.entityId = entityId;
  }
}
