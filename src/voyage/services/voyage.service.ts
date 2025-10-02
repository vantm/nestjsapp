import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { POSTGRES_DATA_SOURCE } from 'src/database/constants';
import { User } from '../../auth/models/user.model';
import { Passenger } from '../../passenger/models/passenger.model';
import { Ship } from '../../ship/models/ship.model';
import { CreateVoyageDto } from '../dto/create-voyage.dto';
import { UpdateVoyageDto } from '../dto/update-voyage.dto';
import { VoyageOnboardingCreatedEvent } from '../events/voyage-onboarding-created.event';
import { VoyageCrew } from '../models/voyage-crew.model';
import { Voyage, VoyageStatus } from '../models/voyage.model';

// TODO: Fix call to other module

@Injectable()
export class VoyageService {
  constructor(
    @Inject(POSTGRES_DATA_SOURCE)
    private readonly dataSource: DataSource,

    @InjectRepository(Voyage)
    private readonly voyageRepository: Repository<Voyage>,

    @InjectRepository(VoyageCrew)
    private readonly voyageCrewRepository: Repository<VoyageCrew>,

    @InjectRepository(Ship)
    private readonly shipRepository: Repository<Ship>,

    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly eventBus: EventBus,
  ) {}

  async create(createVoyageDto: CreateVoyageDto) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const managedShipRepo = manager.withRepository(this.shipRepository);
      const managedPassengerRepo = manager.withRepository(
        this.passengerRepository,
      );

      const managedUserRepo = manager.withRepository(this.userRepository);
      const managedVoyageRepo = manager.withRepository(this.voyageRepository);
      const managedVoyageCrewRepo = manager.withRepository(
        this.voyageCrewRepository,
      );

      const ship = await managedShipRepo.findOne({
        where: { id: createVoyageDto.shipId },
      });

      const guests =
        createVoyageDto.guestIds && createVoyageDto.guestIds.length > 0
          ? await managedPassengerRepo.find({
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

      const voyage = managedVoyageRepo.create(voyageData);

      const savedVoyage = await managedVoyageRepo.save(voyage);

      const users =
        createVoyageDto.crewIds && createVoyageDto.crewIds.length > 0
          ? await managedUserRepo.find({
              where: { id: In(createVoyageDto.crewIds.map(String)) },
            })
          : [];

      const crews = users.map((user) => {
        return managedVoyageCrewRepo.create({
          userId: user.id,
          voyageId: savedVoyage.id,
        });
      });

      await managedVoyageCrewRepo.save(crews);

      return savedVoyage;
    });
  }

  async findAll() {
    return this.voyageRepository.find({
      relations: ['ship', 'guests', 'crews'],
    });
  }

  async findOne(id: number) {
    return this.voyageRepository.findOne({
      where: { id },
      relations: ['ship', 'guests', 'crews'],
    });
  }

  async update(id: number, updateVoyageDto: UpdateVoyageDto) {
    const voyage = await this.voyageRepository.findOne({
      where: { id },
      relations: ['ship', 'guests', 'crews'],
    });

    if (!voyage) {
      throw new NotFoundException('Voyage not found');
    }

    if (voyage.status != VoyageStatus.DRAFT) {
      throw new BadRequestException('Only draft voyages can be updated');
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
    if (updateVoyageDto.crewIds) {
      // voyage.crews = await this.userRepository.find({
      //   where: { id: In(updateVoyageDto.crewIds.map(String)) },
      // });
    }
    Object.assign(voyage, updateVoyageDto);
    return this.voyageRepository.save(voyage);
  }

  async remove(id: number) {
    const voyage = await this.voyageRepository.findOne({ where: { id } });

    if (!voyage) {
      throw new NotFoundException('Voyage not found');
    }

    if (voyage.status != VoyageStatus.DRAFT) {
      throw new BadRequestException('Only draft voyages can be deleted');
    }

    return this.voyageRepository.delete(id);
  }

  async startOnboarding(id: number) {
    const voyage = await this.voyageRepository.findOne({ where: { id } });

    if (!voyage) {
      throw new NotFoundException('Voyage not found');
    }

    if (voyage.status != VoyageStatus.DRAFT) {
      throw new BadRequestException('Only draft voyages can be onboarded');
    }

    voyage.status = VoyageStatus.SCHEDULED;

    this.eventBus.publish(new VoyageOnboardingCreatedEvent(voyage.id));

    return this.voyageRepository.save(voyage);
  }
}
