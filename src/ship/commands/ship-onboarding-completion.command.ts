import { Command } from '@nestjs/cqrs';

export class ShipOnboardingCompletionCommand extends Command<{
  readonly id: number;
  readonly name: string;
}> {
  constructor(
    public readonly shipId: number,
    public readonly topicName: string,
  ) {
    super();
  }
}
