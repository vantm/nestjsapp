import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ShipCreatedEvent } from 'src/ship/events/ship-created.event';

@EventsHandler(ShipCreatedEvent)
export class ShipCreatedHandler implements IEventHandler<ShipCreatedEvent> {
  private readonly logger = new Logger(ShipCreatedHandler.name);

  handle(event: ShipCreatedEvent) {
    this.logger.debug('A ship has been created: ' + JSON.stringify(event));
  }
}
