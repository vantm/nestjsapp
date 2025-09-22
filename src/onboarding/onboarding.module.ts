import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ShipCreatedHandler } from './handlers/ship-created.handler';
import { ShipOnboardingSaga } from './sagas/ship-onboarding.saga';

@Module({
  imports: [CqrsModule],
  providers: [ShipOnboardingSaga, ShipCreatedHandler],
})
export class OnboardingModule {}
