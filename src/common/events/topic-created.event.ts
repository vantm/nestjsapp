export class TopicCreatedEvent {
  constructor(
    public readonly shipId: number,
    public readonly topicName: string,
  ) {}
}
