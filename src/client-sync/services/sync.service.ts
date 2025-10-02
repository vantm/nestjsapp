import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ship } from 'src/ship/models/ship.model';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(Ship)
    private readonly shipRepository: Repository<Ship>,
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
}
