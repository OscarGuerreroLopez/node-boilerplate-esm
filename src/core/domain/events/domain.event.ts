import { BaseDomainEvent } from './base-domain.event';

export class DomainEvent extends BaseDomainEvent<string> {}
export class AggregateDomainEvent extends BaseDomainEvent<string> {}
