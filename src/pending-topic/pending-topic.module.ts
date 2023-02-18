import { Module } from '@nestjs/common';
import { PendingTopicController } from './pending-topic.controller';
import { PendingTopicService } from './pending-topic.service';

@Module({
  controllers: [PendingTopicController],
  providers: [PendingTopicService]
})
export class PendingTopicModule {}
