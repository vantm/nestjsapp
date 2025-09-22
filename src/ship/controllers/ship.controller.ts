import { Body, Controller, Get, HttpCode, Logger, Post } from '@nestjs/common';
import { CreateShipDto } from '../dtos/create-ship.dto';
import { ShipService } from '../services/ship.service';

@Controller('ship')
export class ShipController {
  private readonly logger = new Logger(ShipController.name);

  constructor(private readonly shipService: ShipService) {}

  @Get()
  getShips() {
    return this.shipService.getAll();
  }

  @Post('onboarding')
  @HttpCode(202)
  async createShipOnboarding(@Body() createShipDto: CreateShipDto) {
    this.logger.debug(
      `Received onboarding request: ${JSON.stringify(createShipDto)}`,
    );

    await this.shipService.startOnboarding(createShipDto);
  }
}
