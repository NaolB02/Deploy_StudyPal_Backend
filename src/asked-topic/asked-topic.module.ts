import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/auth/schema/user.schema';
import { PendingTopicSchema } from 'src/pending-topic/schema/pending-topic.schema';
import { AskedTopicController } from './asked-topic.controller';
import { AskedTopicService } from './asked-topic.service';
import { AskedTopicSchema } from './schema/asked-topic.schema';


@Module({
    imports: [
      MongooseModule.forFeature([{name: "AskedTopic", schema: AskedTopicSchema}]),
      AuthModule, 
      PassportModule, 
      MongooseModule.forFeature([{name: "User", schema: UserSchema}]),
      MongooseModule.forFeature([{name: "PendingTopic", schema: PendingTopicSchema}]),
],
    controllers: [AskedTopicController],
  providers: [AskedTopicService]
})
export class AskedTopicModule {}