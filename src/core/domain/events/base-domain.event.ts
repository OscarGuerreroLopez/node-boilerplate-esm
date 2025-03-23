export abstract class BaseDomainEvent<TId = string> {
  readonly occurredAt: Date;
  readonly id: TId;

  constructor(id: TId) {
    this.occurredAt = new Date();
    this.id = id;
  }
}
