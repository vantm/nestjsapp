import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, JwtGuard],
  exports: [PassportModule],
})
export class AuthModule {}
