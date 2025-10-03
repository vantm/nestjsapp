import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTopicDto } from '@app/common/dtos/create-topic.dto';
import { TopicCreatedEvent } from '@app/common/events/topic-created.event';
import { Topic } from '@app/common/models/topic.model';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);

  constructor(
    @InjectRepository(Topic) private readonly topics: Repository<Topic>,
    private readonly eventBus: EventBus,
  ) {}

  async create(createTopicDto: CreateTopicDto) {
    this.logger.debug(`Creating topic for shipId: ${createTopicDto.shipId}`);

    const newTopic = this.topics.create({
      shipId: createTopicDto.shipId,
      topicName: `nestapp.ships.${createTopicDto.shipId}`,
    });

    const topic = await this.topics.save(newTopic);

    this.logger.debug(`Topic created: ${JSON.stringify(topic)}`);

    const event = new TopicCreatedEvent(topic.shipId, topic.topicName);
    this.eventBus.publish(event);

    this.logger.debug(`TopicCreatedEvent published: ${JSON.stringify(event)}`);

    return topic;
  }

  getAll() {
    return this.topics.find();
  }
}
