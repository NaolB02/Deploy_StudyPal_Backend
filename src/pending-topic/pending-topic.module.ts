import { Module } from '@nestjs/common';
import { PendingTopicController } from './pending-topic.controller';
import { PendingTopicService } from './pending-topic.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/auth/schema/user.schema';
import { PendingTopicSchema } from 'src/pending-topic/schema/pending-topic.schema';
import { AskedTopicSchema } from 'src/asked-topic/schema/asked-topic.schema';
import { CompleteTopicSchema } from 'src/complete-topic/schema/complete-topic.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{name: "AskedTopic", schema: AskedTopicSchema}]),
    AuthModule, 
    PassportModule, 
    MongooseModule.forFeature([{name: "PendingTopic", schema: PendingTopicSchema}]),
    MongooseModule.forFeature([{name: "CompleteTopic", schema: CompleteTopicSchema}]),
    MongooseModule.forFeature([{name: "User", schema: UserSchema}])

],
  controllers: [PendingTopicController],
  providers: [PendingTopicService]
})
export class PendingTopicModule {}
