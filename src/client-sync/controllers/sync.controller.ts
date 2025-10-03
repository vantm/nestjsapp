import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { SyncService } from '@app/client-sync/services/sync.service';
import { ClientAttributesDto } from 'src/auth/dtos/client-attributes.dto';
import { AccessKeyGuard } from 'src/auth/guards/access-key.guard';

@UseGuards(AccessKeyGuard)
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('info')
  info(@Request() req: Request & { user: ClientAttributesDto }) {
    const shipId = req.user.shipId;
    return this.syncService.getSyncInfo(shipId);
  }

  @Get('voyages')
  listVoyages(@Request() req: Request & { user: ClientAttributesDto }) {
    const shipId = req.user.shipId;
    return this.syncService.listVoyages(shipId);
  }

  @Get('voyages/:id/users')
  listUsers(
    @Param('id') id: string,
    @Request() req: Request & { user: ClientAttributesDto },
  ) {
    const shipId = req.user.shipId;
    return this.syncService.listUsers(+id, shipId);
  }

  @Get('voyages/:id/guests')
  listGuests(
    @Param('id') id: string,
    @Request() req: Request & { user: ClientAttributesDto },
  ) {
    const shipId = req.user.shipId;
    return this.syncService.listGuests(+id, shipId);
  }
}
