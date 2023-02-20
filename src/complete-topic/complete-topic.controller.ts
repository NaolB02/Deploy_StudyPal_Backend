import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from 'src/auth/schema/user.schema';
import { CompleteTopicService } from './complete-topic.service';
import { CompleteTopic } from './schema/complete-topic.schema';

@UseGuards(JwtGuard)
@Controller('complete-topic')
export class CompleteTopicController {
    constructor( private completeTopicSer: CompleteTopicService){}

    @Get('get-completed-topics')
    async getCompletedTopics(@GetUser() user: User) : Promise<CompleteTopic[]> {
        return await this.completeTopicSer.getCompletedTopics(user);
    }    
}
