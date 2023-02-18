import { Module } from '@nestjs/common';
import { CompleteTopicController } from './complete-topic.controller';
import { CompleteTopicService } from './complete-topic.service';

@Module({
  controllers: [CompleteTopicController],
  providers: [CompleteTopicService]
})
export class CompleteTopicModule {}
