import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TopicService } from 'src/common/services/topic.service';
import { TopicCreationCommand } from '../topic-creation.command';

@CommandHandler(TopicCreationCommand)
export class TopicCreationHandler
  implements ICommandHandler<TopicCreationCommand>
{
  constructor(private readonly topicService: TopicService) {}

  async execute(command: TopicCreationCommand) {
    const ship = await this.topicService.create({ shipId: command.shipId });
    return { shipId: ship.shipId, topicName: ship.topicName };
  }
}
