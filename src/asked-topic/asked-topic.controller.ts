import { Body, Controller, Delete, Get, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AskedTopicService } from './asked-topic.service';
import { CreateAskedTopicDto } from './dto/createAskedTopic.dto';
import { PassportModule } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/auth/schema/user.schema';
import { PatchAskedTopicDto } from './dto/patchAskedTopic.dto';


@UseGuards(JwtGuard)
@Controller('asked-topic')
export class AskedTopicController {
    constructor(private askedTopicService: AskedTopicService){}

    @Post('create-topic')
    async createTopic(@GetUser() user: User, @Body() askedtop: CreateAskedTopicDto){
        return await this.askedTopicService.createTopic(user, askedtop); 
    }
    
    @Get('all-topics')
    async getTopics(@GetUser() user: User){
        return await this.askedTopicService.getTopics(user);
    }

    @Patch('apply')
    async apply(@GetUser() user: User, @Body() body){
        return await this.askedTopicService.apply(user, body.id);
    }

    @Get('get-applicants')
    async getApplicants(@Body() body){
        return this.askedTopicService.get_applicants(body.id)
    }

    @Get('get-my-topics')
    async getMyTopics(@GetUser() user:User){
        return this.askedTopicService.getMyTopics(user)
    }

    @Put('edit-post')
    async editPost(@Body() patchAskedTopic: PatchAskedTopicDto){
        return this.askedTopicService.editPost(patchAskedTopic)
    }

    @Put('accept-applicant')
    async acceptApplicant(@Body() {applicantId, topicId}){
        return await this.askedTopicService.acceptApplicant(applicantId, topicId);
    }

    @Delete('delete-post')
    async deletePost(@Body() {topicId}){
        return await this.askedTopicService.deletePost(topicId)
    }
    
    
}
