import { Injectable, Logger } from '@nestjs/common';
import { ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { TopicCreationCommand } from 'src/common/commands/topic-creation.command';
import { TopicCreatedEvent } from 'src/common/events/topic-created.event';
import { ShipOnboardingCompletionCommand } from 'src/ship/commands/ship-onboarding-completion.command';
import { ShipOnboardingCreatedEvent } from 'src/ship/events/ship-onboarding-created.event';
import { tapLogCommand, tapLogEvent } from './log.util';

@Injectable()
export class ShipOnboardingSaga {
  private readonly logger = new Logger(ShipOnboardingSaga.name);

  @Saga()
  shipOnboarding(event$: Observable<any>): Observable<any> {
    return event$.pipe(
      ofType(ShipOnboardingCreatedEvent),
      tapLogEvent(this.logger),
      map((event) => new TopicCreationCommand(event.id)),
      tapLogCommand(this.logger),
    );
  }

  @Saga()
  shipCreation(event$: Observable<any>): Observable<any> {
    return event$.pipe(
      ofType(TopicCreatedEvent),
      tapLogEvent(this.logger),
      map(
        (event) =>
          new ShipOnboardingCompletionCommand(event.shipId, event.topicName),
      ),
      tapLogCommand(this.logger),
    );
  }
}
