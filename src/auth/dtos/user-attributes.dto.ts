import { User } from '@app/auth/models/user.model';

export class UserAttributesDto {
  id: number;
  emailVerified: boolean;
  enable: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.emailVerified = user.emailVerified;
    this.enable = user.enable;
  }
}
