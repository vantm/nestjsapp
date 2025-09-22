import { Command } from '@nestjs/cqrs';

export class TopicCreationCommand extends Command<{
  readonly shipId: number;
  readonly topicName: string;
}> {
  constructor(public readonly shipId: number) {
    super();
  }
}
