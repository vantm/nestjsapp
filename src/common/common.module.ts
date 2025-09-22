import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from 'src/database/database.module';
import { repositoryProvider } from 'src/database/repository.provider';
import { TopicCreationHandler } from './commands/handlers/topic-creation.handler';
import { TOPIC_REPOSITORY } from './constants';
import { TopicController } from './controllers/topic.controller';
import { Topic } from './models/topic.model';
import { TopicService } from './services/topic.service';

@Module({
  imports: [CqrsModule, DatabaseModule],
  providers: [
    TopicService,
    TopicCreationHandler,
    repositoryProvider({
      provide: TOPIC_REPOSITORY,
      entityType: Topic,
    }),
  ],
  controllers: [TopicController],
})
export class CommonModule {}
