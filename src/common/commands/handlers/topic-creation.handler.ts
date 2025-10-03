import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TopicCreationCommand } from '@app/common/commands/topic-creation.command';
import { TopicService } from 'src/common/services/topic.service';

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
