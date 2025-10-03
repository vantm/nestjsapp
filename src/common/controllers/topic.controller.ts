import { Controller, Get, UseGuards } from '@nestjs/common';
import { TopicService } from '@app/common/services/topic.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  getAll() {
    return this.topicService.getAll();
  }
}
