import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { TOPIC_REPOSITORY } from '../constants';
import { CreateTopicDto } from '../dtos/create-topic.dto';
import { TopicCreatedEvent } from '../events/topic-created.event';
import { Topic } from '../models/topic.model';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);

  constructor(
    @Inject(TOPIC_REPOSITORY) private readonly topics: Repository<Topic>,
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
