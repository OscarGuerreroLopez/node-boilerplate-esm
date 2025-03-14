import { UserRegisteredEvent } from '../events/user-register.event';
import { EmailVo } from '../../value-objects/email';
import { NameVo } from '../../value-objects/name';
import { Entity } from '../../entities/entity';

interface UserProps {
  email: EmailVo;
  name: NameVo;
}

export class UserEntity extends Entity<UserProps> {
  private constructor(props: UserProps, entityId?: string) {
    super(props, entityId);
  }

  /** 📌 Factory method to create a new user */
  public static create({ email, name }: { email: string; name: string }, entityId?: string): UserEntity {
    const emailVo = EmailVo.create(email);
    const nameVo = NameVo.create(name);
    const user = new UserEntity({ email: emailVo, name: nameVo }, entityId);

    // Raise an event!
    user.addDomainEvent(new UserRegisteredEvent({ entityId: user.entityId, email: emailVo.value, name: nameVo.value }));

    return user;
  }

  public static fromData(data: { email: string; name: string; entityId?: string }): UserEntity {
    const emailVo = EmailVo.create(data.email);
    const nameVo = NameVo.create(data.name);
    return new UserEntity({ email: emailVo, name: nameVo }, data.entityId);
  }

  public getName(): NameVo {
    return this.props.name;
  }

  public getEmail(): EmailVo {
    return this.props.email;
  }
}
