import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pick } from 'lodash';
import { In, Repository } from 'typeorm';
import { User } from 'src/auth/models/user.model';
import { Ship } from 'src/ship/models/ship.model';
import { Voyage, VoyageStatus } from 'src/voyage/models/voyage.model';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(Ship)
    private readonly shipRepository: Repository<Ship>, // TODO avoid call to other module
    @InjectRepository(Voyage)
    private readonly voyageRepository: Repository<Voyage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getSyncInfo(shipId: number) {
    this.logger.debug(`Fetching sync info for ship ID: ${shipId}`);

    const ship = await this.shipRepository.findOne({
      where: { id: shipId },
    });

    if (!ship) {
      throw new NotFoundException(`Ship with ID ${shipId} not found`);
    }

    this.logger.debug(
      `Sync info for ship ID ${shipId}: ${JSON.stringify(ship)}`,
    );

    return {
      id: ship.id,
      name: ship.name,
      topicName: ship.topicName,
    };
  }

  listVoyages(shipId: number) {
    return this.voyageRepository.find({
      where: {
        shipId,
        status: In([VoyageStatus.SCHEDULED, VoyageStatus.ONGOING]),
      },
    });
  }

  async listUsers(voyageId: number, shipId: number) {
    const voyage = await this.voyageRepository.findOne({
      where: {
        id: voyageId,
        shipId,
        status: In([VoyageStatus.SCHEDULED, VoyageStatus.ONGOING]),
      },
      relations: {
        crews: {
          user: true,
        },
      },
    });

    if (!voyage) {
      throw new NotFoundException(
        `Voyage with ID ${voyageId} not found for ship ID ${shipId}`,
      );
    }

    return voyage.crews.map((crew) =>
      pick(crew.user, [
        'id',
        'email',
        'givenName',
        'familyName',
        'middleName',
        'password',
        'enable',
      ]),
    );
  }

  async listGuests(voyageId: number, shipId: number) {
    const voyage = await this.voyageRepository.findOne({
      where: {
        id: voyageId,
        shipId,
        status: In([VoyageStatus.SCHEDULED, VoyageStatus.ONGOING]),
      },
      relations: {
        guests: true,
      },
    });

    if (!voyage) {
      throw new NotFoundException(
        `Voyage with ID ${voyageId} not found for ship ID ${shipId}`,
      );
    }

    return voyage.guests;
  }
}
