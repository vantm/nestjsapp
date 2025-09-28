import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Passenger } from '../passenger/models/passenger.model';
import { Ship } from '../ship/models/ship.model';
import { CreateVoyageDto } from './dto/create-voyage.dto';
import { UpdateVoyageDto } from './dto/update-voyage.dto';
import { Voyage } from './models/voyage.model';

@Injectable()
export class VoyageService {
  constructor(
    @InjectRepository(Voyage)
    private readonly voyageRepository: Repository<Voyage>,
    @InjectRepository(Ship)
    private readonly shipRepository: Repository<Ship>,
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
  ) {}

  async create(createVoyageDto: CreateVoyageDto) {
    const ship = await this.shipRepository.findOne({
      where: { id: createVoyageDto.shipId },
    });
    const guests =
      createVoyageDto.guestIds && createVoyageDto.guestIds.length > 0
        ? await this.passengerRepository.find({
            where: { id: In(createVoyageDto.guestIds) },
          })
        : [];
    const voyageData: Partial<Voyage> = {
      ...createVoyageDto,
      guests,
    };
    if (ship) {
      voyageData.ship = ship;
    }
    const voyage = this.voyageRepository.create(voyageData);
    return this.voyageRepository.save(voyage);
  }

  async findAll() {
    return this.voyageRepository.find({
      relations: ['ship', 'guests'],
    });
  }

  async findOne(id: number) {
    return this.voyageRepository.findOne({
      where: { id },
      relations: ['ship', 'guests'],
    });
  }

  async update(id: number, updateVoyageDto: UpdateVoyageDto) {
    const voyage = await this.voyageRepository.findOne({
      where: { id },
      relations: ['ship', 'guests'],
    });
    if (!voyage) {
      return null;
    }
    if (updateVoyageDto.shipId) {
      const ship = await this.shipRepository.findOne({
        where: { id: updateVoyageDto.shipId },
      });
      if (ship) {
        voyage.ship = ship;
      }
    }
    if (updateVoyageDto.guestIds) {
      voyage.guests = await this.passengerRepository.find({
        where: { id: In(updateVoyageDto.guestIds) },
      });
    }
    Object.assign(voyage, updateVoyageDto);
    return this.voyageRepository.save(voyage);
  }

  async remove(id: number) {
    return this.voyageRepository.delete(id);
  }
}
