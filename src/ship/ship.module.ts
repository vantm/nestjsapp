import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from 'src/database/database.module';
import { repositoryProvider } from 'src/database/repository.provider';
import { ShipOnboardingCompletionHandler } from './commands/handlers/ship-onboarding-completion.handler';
import { SHIP_REPOSITORY } from './constants';
import { ShipController } from './controllers/ship.controller';
import { Ship } from './models/ship.model';
import { ShipService } from './services/ship.service';

@Module({
  imports: [CqrsModule, DatabaseModule],
  providers: [
    ShipService,
    ShipOnboardingCompletionHandler,
    repositoryProvider({
      provide: SHIP_REPOSITORY,
      entityType: Ship,
    }),
  ],
  controllers: [ShipController],
})
export class ShipModule {}
