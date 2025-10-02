import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ShipCreatedHandler } from './handlers/ship-created.handler';
import { ShipOnboardingSaga } from './sagas/ship-onboarding.saga';
import { VoyageOnboardingSaga } from './sagas/voyage-onboarding.saga';

@Module({
  imports: [CqrsModule],
  providers: [
    /// Ship Onboarding
    ShipOnboardingSaga,
    ShipCreatedHandler,

    // Voyage Onboarding
    VoyageOnboardingSaga,
  ],
})
export class OnboardingModule {}
