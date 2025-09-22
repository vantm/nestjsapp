import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ShipService } from 'src/ship/services/ship.service';
import { ShipOnboardingCompletionCommand } from '../ship-onboarding-completion.command';

@CommandHandler(ShipOnboardingCompletionCommand)
export class ShipOnboardingCompletionHandler
  implements ICommandHandler<ShipOnboardingCompletionCommand>
{
  constructor(private readonly shipService: ShipService) {}

  async execute(command: ShipOnboardingCompletionCommand) {
    const ship = await this.shipService.completeOnboarding(
      command.shipId,
      command.topicName,
    );

    return { id: ship.id, name: ship.name };
  }
}
