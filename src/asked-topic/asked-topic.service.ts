import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { PendingTopic } from 'src/pending-topic/schema/pending-topic.schema';
import { CreateAskedTopicDto } from './dto/createAskedTopic.dto';
import { PatchAskedTopicDto } from './dto/patchAskedTopic.dto';
import { AskedTopic } from './schema/asked-topic.schema';

@Injectable()
export class AskedTopicService {
    constructor(
        @InjectModel('AskedTopic') private readonly askedTopicModel: Model<AskedTopic>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('PendingTopic') private readonly pendingModel: Model<PendingTopic>
        ){
    }

    ObjectId = mongoose.Types.ObjectId;
    async createTopic(user: User, askedTop: CreateAskedTopicDto) {
        let newTopic  = new this.askedTopicModel(askedTop);
        newTopic.owner = user.id;
        const result = await newTopic.save();
        return result;
    }


    async getTopics(user:User){
        const filter = {owner: {$ne: user.id}}
        return await this.askedTopicModel.find(filter);
    }

    async apply(user: User, topicId){ 
        const filter = { _id:new this.ObjectId(topicId) };
        const top = await this.askedTopicModel.findOne(filter);
        console.log(top)
        
        if (top.applicants.includes(user.id)) {
            return "Already Applied";
        }
        top.applicants.push(user.id);

        const update = { applicants:top.applicants }
        await this.askedTopicModel.findOneAndUpdate(filter, update);
        return await this.askedTopicModel.find(filter);

    }

    async getMyTopics(user:User){
        const filter = {owner: user.id}
        const my_topics = await this.askedTopicModel.find(filter)
        return my_topics
    }


    async get_applicants(topicId:string){
        const filter = {_id : new this.ObjectId(topicId)}

        const cur_topic = await this.askedTopicModel.findOne(filter)
        // console.log(cur_topic, "is the topic found")
        let foundApplicants = []

        for (let applicantId of cur_topic.applicants){
            let app_filter = {_id : applicantId}
            let applicant = await this.userModel.findOne(app_filter)
            foundApplicants.push(applicant)
        }


        return  foundApplicants;
    }

    async editPost(updateDto: PatchAskedTopicDto){
        const filter = {_id : new this.ObjectId(updateDto.id)}
        const update = {title: updateDto.title, desc: updateDto.desc , tag: updateDto.tag}
        
        const topic = await this.askedTopicModel.findOneAndUpdate(filter, update)
        const updated = await this.askedTopicModel.findOne(filter)
        return updated

    }

    async acceptApplicant(applicantId: string, topicId: string){
        const filter_topic = {_id : new this.ObjectId(topicId)}
        const topic = await this.askedTopicModel.findOneAndDelete(filter_topic)
        const newtopic = { title: topic.title, desc: topic.desc, tag: topic.tag, owner: topic.owner, tutor: new this.ObjectId(applicantId)}
        const newPending = new this.pendingModel(newtopic);
        return await newPending.save();
        
    }
    

    async deletePost(topicId: string){
        const filter = {_id : new this.ObjectId(topicId)}
        const topic = await this.askedTopicModel.findOneAndDelete(filter)
        return topic
    }

}