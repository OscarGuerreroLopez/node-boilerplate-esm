import { DomainEvent } from '../../events/domain.event';

interface UserRegisteredEventProps {
  entityId: string;
  email: string;
  name: string;
}

export class UserRegisteredEvent extends DomainEvent {
  public readonly email: string;
  public readonly name: string;

  constructor({ entityId, email, name }: UserRegisteredEventProps) {
    super(entityId);
    this.email = email;
    this.name = name;
  }
}
