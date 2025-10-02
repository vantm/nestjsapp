import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { CreateShipDto } from 'src/ship/dtos/create-ship.dto';
import { ShipCreatedEvent } from 'src/ship/events/ship-created.event';
import { ShipOnboardingCreatedEvent } from 'src/ship/events/ship-onboarding-created.event';
import { Ship, ShipStatus } from 'src/ship/models/ship.model';

@Injectable()
export class ShipService {
  private readonly logger = new Logger(ShipService.name);

  constructor(
    @InjectRepository(Ship) private readonly ships: Repository<Ship>,
    private readonly eventBus: EventBus,
  ) {}

  async startOnboarding(createShipDto: CreateShipDto) {
    this.logger.debug('Starting onboarding for ship: ' + createShipDto.name);

    const newShip = this.ships.create({
      ...createShipDto,
      status: ShipStatus.Pending,
      topicName: '',
      accessKey: `sak-${crypto.randomUUID()}`,
    });

    const ship = await this.ships.save(newShip);

    this.logger.debug('Ship created: ' + JSON.stringify(ship));

    const event = new ShipOnboardingCreatedEvent(ship.id, ship.name);
    this.eventBus.publish(event);

    this.logger.debug(
      'ShipOnboardingCreatedEvent published: ' + JSON.stringify(event),
    );

    return ship;
  }

  async completeOnboarding(id: number, topicName: string) {
    this.logger.debug('Completing onboarding for shipId: ' + id);

    const ship = await this.ships.findOneBy({ id: id });

    if (!ship) {
      throw new Error('Ship not found');
    }

    ship.completeOnboarding(topicName);

    await this.ships.save(ship);

    this.logger.debug('Completed onboarding for shipId: ' + id);

    const event = new ShipCreatedEvent(ship.id, ship.name);
    this.eventBus.publish(event);

    this.logger.debug('ShipCreatedEvent published: ' + JSON.stringify(event));

    return ship;
  }

  async getAll() {
    const ships = await this.ships.find({
      where: {
        status: Not(In([ShipStatus.Pending, ShipStatus.Deleted])),
      },
    });

    return ships;
  }
}
