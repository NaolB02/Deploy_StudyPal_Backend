import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from 'src/auth/schema/user.schema';
import { PendingTopicService } from './pending-topic.service';

@UseGuards(JwtGuard)
@Controller('pending-topic')
export class PendingTopicController {
    constructor(
        private pendingTopSer: PendingTopicService
    ){}
    
    @Get('pending-topic')
    async getTopics(@GetUser() user: User) {
        return await this.pendingTopSer.getTopics(user);
    }

    @Get('pending-tasks')
    async getTasks(@GetUser() user: User) {
        return await this.pendingTopSer.getTasks(user);
    }

    @Post('start-session')
    async startSession(@GetUser() user: User, @Body() body){
        return await this.pendingTopSer.startSession(user, body.topicId);
    }

    @Post('end-session')
    async endSession(@GetUser() user: User, @Body() body){
        return await this.pendingTopSer.endSession(user, body.topicId);
    }

    @Put('cancel-session')
    async cancelSession(@GetUser() user: User, @Body() body){
        return await this.pendingTopSer.cancelSession(user, body.topicId);
    }

    @Put('check-status')
    async checkStatus(@GetUser() user: User, @Body() body){
        return await this.pendingTopSer.checkStatus(user, body.topicId);
    }
}
