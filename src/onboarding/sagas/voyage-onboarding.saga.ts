import { Injectable, Logger } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';
import { TopicCreationCommand } from 'src/common/commands/topic-creation.command';
import { VoyageOnboardingCreatedEvent } from 'src/voyage/events/voyage-onboarding-created.event';
import { tapLogEvent, tapLogCommand } from './log.util';

@Injectable()
export class VoyageOnboardingSaga {
  private readonly logger = new Logger(VoyageOnboardingSaga.name);

  @Saga()
  voyageOnboarding(event$: Observable<any>): Observable<any> {
    return event$.pipe(
      ofType(VoyageOnboardingCreatedEvent),
      tapLogEvent(this.logger),
      map((event) => new TopicCreationCommand(event.id)),
      tapLogCommand(this.logger),
    );
  }
}
