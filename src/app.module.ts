import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ShipModule } from './ship/ship.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    AuthModule,
    HealthModule,
    CommonModule,
    ShipModule,
    OnboardingModule,
  ],
})
export class AppModule {}
