import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/auth/schema/user.schema';
import { CompleteTopicController } from './complete-topic.controller';
import { CompleteTopicService } from './complete-topic.service';
import { CompleteTopicSchema } from './schema/complete-topic.schema';

@Module({
  imports: [
    AuthModule, 
    PassportModule,
    MongooseModule.forFeature([{name: "User", schema: UserSchema}]),
    MongooseModule.forFeature([{name: "CompleteTopic", schema: CompleteTopicSchema}])
  ],
  controllers: [CompleteTopicController],
  providers: [CompleteTopicService]
})
export class CompleteTopicModule {}
