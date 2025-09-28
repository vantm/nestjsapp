import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { repositoryProvider } from 'src/database/repository.provider';
import { Passenger } from './models/passenger.model';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PassengerController],
  providers: [PassengerService, repositoryProvider(Passenger)],
})
export class PassengerModule {}
