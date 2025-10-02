import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateShipDto } from '../dtos/create-ship.dto';
import { ShipService } from '../services/ship.service';

@Controller('ship')
@UseGuards(JwtGuard)
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
