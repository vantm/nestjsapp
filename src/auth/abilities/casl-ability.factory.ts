import { AbilityBuilder, PureAbility } from '@casl/ability';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from 'src/common/models/topic.model';
import { Ship } from 'src/ship/models/ship.model';
import { UserAttributesDto } from '../dtos/user-attributes.dto';
import { Action } from '../enums/action.enum';
import { User } from '../models/user.model';

type Subjects = typeof User | typeof Ship | typeof Topic;

export type AppAbility = PureAbility<[Action, Subjects]>;

export class CaslAbilityFactory {
  private readonly logger = new Logger(CaslAbilityFactory.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createForUser(identitySubject: string) {
    const { can, cannot, build } = new AbilityBuilder(
      PureAbility<[Action, Subjects]>,
    );

    const denyAll = (reason: string) => {
      cannot(
        [Action.Read, Action.Create, Action.Update, Action.Delete],
        [User, Ship, Topic],
      ).because(reason);
    };

    const user = await this.userRepository.findOne({
      where: { subject: identitySubject },
      relations: {
        permissions: true,
      },
    });

    if (!user) {
      denyAll('User not found');
      return build();
    }

    const attributes = new UserAttributesDto(user);

    if (!attributes.emailVerified || !attributes.enable) {
      const reason = !attributes.emailVerified
        ? 'Email is not verified'
        : 'User is not enabled';

      denyAll(reason);

      return build();
    }

    for (const permission of user.permissions || []) {
      const [wasParsingSucceed, conditions] = this.parseConditions(permission);
      if (!wasParsingSucceed) {
        this.logger.warn(
          `Skipping permission ${permission.name} (${permission.id}) due to conditions parsing error`,
        );
        continue;
      }

      const [isResourceValid, resource] = this.parseResource(
        permission.resource,
      );

      if (!isResourceValid) {
        this.logger.warn(
          `Skipping permission ${permission.name} (${permission.id}) due to unknown resource "${permission.resource}"`,
        );
        continue;
      }

      const [isActionValid, action] = this.parseAction(permission.action);
      if (!isActionValid) {
        this.logger.warn(
          `Skipping permission ${permission.name} (${permission.id}) due to unknown action "${permission.action}"`,
        );
        continue;
      }

      switch (action) {
        case Action.Create:
          can(Action.Create, resource, conditions);
          break;
        case Action.Read:
          can(Action.Read, resource, conditions);
          break;
        case Action.Update:
          can(Action.Update, resource, conditions);
          break;
        case Action.Delete:
          can(Action.Delete, resource, conditions);
          break;
      }
    }

    return build();
  }

  private parseConditions(
    permission: User['permissions'][number],
  ): [true, object | undefined] | [false, undefined] {
    if (!permission?.conditions) {
      return [true, undefined];
    }
    try {
      return [true, JSON.parse(permission.conditions)];
    } catch (error) {
      this.logger.warn(
        `Failed to parse conditions for permission ${permission.name} (${permission.id}): ${error}`,
      );
      return [false, undefined];
    }
  }

  private parseResource(
    resource: string,
  ): [true, Subjects] | [false, undefined] {
    switch (resource) {
      case 'User':
        return [true, User];
      case 'Ship':
        return [true, Ship];
      case 'Topic':
        return [true, Topic];
      default:
        return [false, undefined];
    }
  }

  private parseAction(action: string): [true, Action] | [false, undefined] {
    switch (action) {
      case Action.Create.toString():
        return [true, Action.Create];
      case Action.Read.toString():
        return [true, Action.Read];
      case Action.Update.toString():
        return [true, Action.Update];
      case Action.Delete.toString():
        return [true, Action.Delete];
      default:
        return [false, undefined];
    }
  }
}
