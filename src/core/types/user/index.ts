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
  kycStatus: Status;
  emailStatus: Status;
  addresses: Address[];
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
  CHECKING = 'CHECKING',
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED',
}
