import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { Passenger } from './models/passenger.model';

@Injectable()
export class PassengerService {
  constructor(
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
  ) {}

  create(createPassengerDto: CreatePassengerDto) {
    const passenger = this.passengerRepository.create(createPassengerDto);
    return this.passengerRepository.save(passenger);
  }

  findAll() {
    return this.passengerRepository.find();
  }

  findOne(id: number) {
    return this.passengerRepository.findOne({ where: { id } });
  }

  update(id: number, updatePassengerDto: UpdatePassengerDto) {
    return this.passengerRepository.update(id, updatePassengerDto);
  }

  remove(id: number) {
    return this.passengerRepository.delete(id);
  }
}
