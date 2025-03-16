import { UserRegisteredEvent } from '../events/user-register.event';
import { EmailVo } from '../../value-objects/email';
import { NameVo } from '../../value-objects/name';
import { Entity } from '../../entities/entity';
import { UserStatusVo } from '../../value-objects/status';
import { type Status } from '@/core/types/user';

interface UserProps {
  email: EmailVo;
  name: NameVo;
  status: UserStatusVo;
}

export class UserEntity extends Entity<UserProps> {
  private constructor(props: UserProps, entityId?: string) {
    super(props, entityId);
  }

  /** 📌 Factory method to create a new user */
  public static create({ email, name, status }: { email: string; name: string; status?: Status }, entityId?: string): UserEntity {
    const emailVo = EmailVo.create(email);
    const nameVo = NameVo.create(name);
    const statusVo = UserStatusVo.create(status);

    const user = new UserEntity({ email: emailVo, name: nameVo, status: statusVo }, entityId);

    // Raise an event!
    user.addDomainEvent(
      new UserRegisteredEvent({ entityId: user.entityId, email: emailVo.value, name: nameVo.value, status: statusVo.value }),
    );

    return user;
  }

  public static fromData(data: { email: string; name: string; status?: Status; entityId?: string }): UserEntity {
    const emailVo = EmailVo.create(data.email);
    const nameVo = NameVo.create(data.name);
    const statusVo = UserStatusVo.create(data.status);

    return new UserEntity({ email: emailVo, name: nameVo, status: statusVo }, data.entityId);
  }

  public getName(): NameVo {
    return this.props.name;
  }

  public getEmail(): EmailVo {
    return this.props.email;
  }

  public getStatus(): UserStatusVo {
    return this.props.status;
  }

  public changeName(name: string): this {
    const nameVo = NameVo.create(name);
    if (this.props.name.equals(nameVo)) {
      return this;
    }

    this.props.name = nameVo;
    return this;
  }

  public changeEmail(email: string): this {
    const emailVo = EmailVo.create(email);
    if (this.props.email.equals(emailVo)) {
      return this;
    }

    this.props.email = emailVo;
    return this;
  }

  public changeStatus(status: Status): this {
    const statusVo = UserStatusVo.create(status);
    if (this.props.status.equals(statusVo)) {
      return this;
    }

    this.props.status = statusVo;
    return this;
  }
}
