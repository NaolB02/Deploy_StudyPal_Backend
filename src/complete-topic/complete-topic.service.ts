import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompleteTopic } from './schema/complete-topic.schema';

@Injectable()
export class CompleteTopicService {
    constructor(
        @InjectModel('CompleteTopic') private readonly completeTopicModel: Model<CompleteTopic>
    ){}

    

}
