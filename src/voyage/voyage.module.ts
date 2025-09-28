import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { repositoryProvider } from 'src/database/repository.provider';
import { Passenger } from 'src/passenger/models/passenger.model';
import { Ship } from 'src/ship/models/ship.model';
import { Voyage } from './models/voyage.model';
import { VoyageController } from './voyage.controller';
import { VoyageService } from './voyage.service';

@Module({
  imports: [DatabaseModule],
  controllers: [VoyageController],
  providers: [
    repositoryProvider(Passenger),
    repositoryProvider(Ship),
    repositoryProvider(Voyage),
    VoyageService,
  ],
})
export class VoyageModule {}
