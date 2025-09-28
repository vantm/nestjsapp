import { Module } from '@nestjs/common';
import { repositoryProvider } from 'src/database/repository.provider';
import { Passenger } from './models/passenger.model';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';

@Module({
  controllers: [PassengerController],
  providers: [PassengerService, repositoryProvider(Passenger)],
})
export class PassengerModule {}
