import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PassengerModule } from './passenger/passenger.module';
import { ShipModule } from './ship/ship.module';
import { VoyageModule } from './voyage/voyage.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    ScheduleModule.forRoot({}),
    AuthModule,
    HealthModule,
    CommonModule,
    ShipModule,
    OnboardingModule,
    PassengerModule,
    VoyageModule,
  ],
})
export class AppModule {}
