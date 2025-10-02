import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { Repository } from 'typeorm';
import { Ship, ShipStatus } from 'src/ship/models/ship.model';
import { ClientAttributesDto } from '../dtos/client-attributes.dto';

@Injectable()
export class AcccessKeyStrategy extends PassportStrategy<
  typeof HeaderAPIKeyStrategy,
  ClientAttributesDto
>(HeaderAPIKeyStrategy, 'access-key') {
  private readonly logger = new Logger(AcccessKeyStrategy.name);

  constructor(
    @InjectRepository(Ship)
    private readonly shipRepository: Repository<Ship>,
  ) {
    super({ header: 'x-api-key', prefix: '' }, false);
  }

  async validate(apiKey: string): Promise<false | ClientAttributesDto | null> {
    this.logger.debug(`Validating access key: ${apiKey}`);

    const ship = await this.shipRepository.findOne({
      where: { accessKey: apiKey },
    });

    this.logger.debug(`Found ship: ${ship?.id}`);

    if (ship == null || ship.status !== ShipStatus.Active) {
      return false;
    }

    this.logger.log(`Access key valid for ship: ${ship.id}`);

    return { shipId: ship.id };
  }
}
