import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { repositoryProvider } from 'src/database/repository.provider';
import { Ship } from 'src/ship/models/ship.model';
import { SyncController } from './controllers/sync.controller';
import { SyncService } from './services/sync.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SyncController],
  providers: [
    SyncService,
    repositoryProvider(Ship), // TODO : Fix call to other module
  ],
})
export class ClientSyncModule {}
