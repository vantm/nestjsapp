import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ShipOnboardingCompletionCommand } from '@app/ship/commands/ship-onboarding-completion.command';
import { ShipService } from 'src/ship/services/ship.service';

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
