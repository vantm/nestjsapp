import { Controller, HttpCode, Logger, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { TaskService } from '../services/task.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtGuard)
  @Post('user-sync')
  @HttpCode(202)
  async triggerUserSync() {
    await this.taskService.triggerUserSync();
    return { message: 'User sync job triggered' };
  }
}
