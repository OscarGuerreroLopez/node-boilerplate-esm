export interface Address {
  street: string;
  city: string;
  country: string;
  status?: Status;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  status: Status;
  addresses: Address[];
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  REJECTED = 'rejected',
  DELETED = 'deleted',
  CHECKING = 'checking',
  VERIFIED = 'verified',
  UNVERIFIED = 'unverified',
  SUSPENDED = 'suspended',
  BLOCKED = 'blocked',
}
