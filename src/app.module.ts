import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ShipModule } from './ship/ship.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    HealthModule,
    CommonModule,
    ShipModule,
    OnboardingModule,
    AuthModule,
  ],
})
export class AppModule {}
