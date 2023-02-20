import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { CompleteTopic } from './schema/complete-topic.schema';

@Injectable()
export class CompleteTopicService {
    constructor(
        @InjectModel('CompleteTopic') private readonly completeTopicModel: Model<CompleteTopic>
    ){}

    async getCompletedTopics(user: User): Promise<CompleteTopic[]> {
        const filter = { owner: user._id }
        const theTopics = await this.completeTopicModel.find(filter);
        return theTopics;
    }

}
