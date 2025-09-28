import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/database/database.module';
import { repositoryProvider } from 'src/database/repository.provider';
import { AuthController } from './auth.controller';
import { CaslAbilityFactory } from './casl-ability.factory';
import { JwtGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { TaskService } from './task.service';
import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
  ],
  controllers: [AuthController, UserController],
  providers: [
    JwtStrategy,
    JwtGuard,
    UserService,
    TaskService,
    repositoryProvider(User),
    CaslAbilityFactory,
  ],
  exports: [PassportModule, CaslAbilityFactory],
})
export class AuthModule {}
