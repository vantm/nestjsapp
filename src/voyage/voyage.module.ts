import { Module } from '@nestjs/common';
import { User } from 'src/auth/user.model';
import { DatabaseModule } from 'src/database/database.module';
import {
  readonlyRepositoryProvider,
  repositoryProvider,
} from 'src/database/repository.provider';
import { Passenger } from 'src/passenger/models/passenger.model';
import { Ship } from 'src/ship/models/ship.model';
import { VoyageCrew } from './models/voyage-crew.model';
import { Voyage } from './models/voyage.model';
import { VoyageController } from './voyage.controller';
import { VoyageService } from './voyage.service';

@Module({
  imports: [DatabaseModule],
  controllers: [VoyageController],
  providers: [
    repositoryProvider(Voyage),
    repositoryProvider(VoyageCrew),
    readonlyRepositoryProvider(Passenger),
    readonlyRepositoryProvider(Ship),
    readonlyRepositoryProvider(User),
    VoyageService,
  ],
})
export class VoyageModule {}
