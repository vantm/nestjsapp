import { User } from './user.model';

export class UserAttributes {
  id: number;
  emailVerified: boolean;
  enable: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.emailVerified = user.emailVerified;
    this.enable = user.enable;
  }
}
