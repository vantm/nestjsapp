import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { TopicService } from '../services/topic.service';

@UseGuards(JwtGuard)
@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  getAll() {
    return this.topicService.getAll();
  }
}
