import { Controller, Get } from '@nestjs/common';
import { TopicService } from '../services/topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  getAll() {
    return this.topicService.getAll();
  }
}
