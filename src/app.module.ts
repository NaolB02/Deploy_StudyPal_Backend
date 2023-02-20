import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PendingTopicModule } from './pending-topic/pending-topic.module';
import { CompleteTopicModule } from './complete-topic/complete-topic.module';
import { AskedTopicModule } from './asked-topic/asked-topic.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://root:root@cluster0.0tudfdc.mongodb.net/study_pal?retryWrites=true&w=majority"), 
    AuthModule,
    AskedTopicModule,
    PendingTopicModule,
    CompleteTopicModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProfileModule
  ],

})
export class AppModule {}
