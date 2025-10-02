import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/database/database.module';
import { repositoryProvider } from 'src/database/repository.provider';
import { Ship } from 'src/ship/models/ship.model';
import { CaslAbilityFactory } from './abilities/casl-ability.factory';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { AccessKeyGuard } from './guards/access-key.guard';
import { JwtGuard } from './guards/jwt.guard';
import { User } from './models/user.model';
import { TaskService } from './services/task.service';
import { UserService } from './services/user.service';
import { AcccessKeyStrategy } from './strategies/access-key.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
  ],
  controllers: [AuthController, UserController],
  providers: [
    JwtStrategy,
    JwtGuard,
    AcccessKeyStrategy,
    AccessKeyGuard,
    UserService,
    TaskService,
    repositoryProvider(User),
    repositoryProvider(Ship), // TODO: Fix call to other module
    CaslAbilityFactory,
  ],
  exports: [PassportModule, CaslAbilityFactory],
})
export class AuthModule {}
