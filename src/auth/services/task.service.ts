import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from './user.service';

const EveryDayCronExpression = '0 0 0 * * *';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly userService: UserService) {}

  @Cron(EveryDayCronExpression, {
    name: 'UserSync',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleCron() {
    this.logger.log('UserSync cron job started');
    await this.userService.syncFromCognito();
    this.logger.log('UserSync cron job completed');
  }

  async triggerUserSync() {
    this.logger.log('Manual User sync starting...');
    await this.userService.syncFromCognito();
    this.logger.log('Manual User sync completed');
  }
}
