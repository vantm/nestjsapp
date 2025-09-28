import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { fromSSO } from '@aws-sdk/credential-providers';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.model';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  listUsers() {
    return this.userRepository.find();
  }

  async syncFromCognito() {
    this.logger.log('User sync starting...');

    const client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION_ID,
      // TODO: support ACCESS_KEY_ID and SECRET_ACCESS_KEY instead
      credentials: fromSSO({ profile: 'default' }),
    });

    let previousPaginationToken: string | undefined = undefined;
    do {
      this.logger.debug(
        'Fetching users with pagination token: ' + previousPaginationToken,
      );

      previousPaginationToken = await this.handlePage(
        client,
        previousPaginationToken,
      );
    } while (previousPaginationToken);

    this.logger.log('User sync completed');
  }

  async handlePage(
    client: CognitoIdentityProviderClient,
    previousPaginationToken: string | undefined,
  ): Promise<string | undefined> {
    const command = new ListUsersCommand({
      UserPoolId: process.env.AWS_USER_POOL_ID,
      Limit: Number(50),
      PaginationToken: previousPaginationToken,
      AttributesToGet: [
        'sub',
        'email',
        'email_verified',
        'given_name',
        'family_name',
        'middle_name',
      ],
    });

    const response = await client.send(command);

    if (Array.isArray(response.Users)) {
      await this.userRepository
        .createQueryBuilder()
        .insert()
        .orUpdate(
          [
            'email',
            'emailVerified',
            'givenName',
            'familyName',
            'middleName',
            'enable',
            'status',
          ],
          ['subject'],
          {
            skipUpdateIfNoValuesChanged: true,
          },
        )
        .values(response.Users.map((user) => this.toUserModel(user)))
        .execute();
    }

    return response.PaginationToken;
  }

  toUserModel(
    user: ListUsersCommandOutput['Users'] extends Array<infer U> | undefined
      ? U
      : never,
  ) {
    const findAttr = (name: string) =>
      user.Attributes?.find((attr) => attr.Name === name)?.Value;

    const users = this.userRepository.create({
      subject: findAttr('sub'),
      email: findAttr('email'),
      emailVerified: findAttr('email_verified') === 'true',
      givenName: findAttr('given_name'),
      familyName: findAttr('family_name'),
      middleName: findAttr('middle_name'),
      enable: user.Enabled ?? false,
      status: user.UserStatus,
    });

    assertMustDefined(users.subject);
    assertMustDefined(users.email);

    return users;
  }
}

function assertMustDefined<T>(value: T | null | undefined): asserts value is T {
  if (value == null) {
    throw new Error('Value is null');
  }
}
