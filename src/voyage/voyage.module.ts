import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { User } from 'src/auth/models/user.model';
import { DatabaseModule } from 'src/database/database.module';
import { repositoryProvider } from 'src/database/repository.provider';
import { Passenger } from 'src/passenger/models/passenger.model';
import { Ship } from 'src/ship/models/ship.model';
import { VoyageController } from './controllers/voyage.controller';
import { VoyageCrew } from './models/voyage-crew.model';
import { Voyage } from './models/voyage.model';
import { VoyageService } from './services/voyage.service';

@Module({
  imports: [DatabaseModule, CqrsModule],
  controllers: [VoyageController],
  providers: [
    repositoryProvider(Voyage),
    repositoryProvider(VoyageCrew),
    repositoryProvider(Passenger),
    repositoryProvider(Ship),
    repositoryProvider(User),
    VoyageService,
  ],
})
export class VoyageModule {}
