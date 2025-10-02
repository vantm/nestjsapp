import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ClientAttributesDto } from 'src/auth/dtos/client-attributes.dto';
import { AccessKeyGuard } from 'src/auth/guards/access-key.guard';
import { SyncService } from '../services/sync.service';

@UseGuards(AccessKeyGuard)
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('info')
  info(@Request() req: Request & { user?: ClientAttributesDto }) {
    const shipId = req.user?.shipId;

    if (shipId == null) {
      return { message: 'No ship ID found in request' };
    }

    return this.syncService.getSyncInfo(shipId);
  }
}
