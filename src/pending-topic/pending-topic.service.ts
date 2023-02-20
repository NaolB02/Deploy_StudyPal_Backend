import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AskedTopic } from 'src/asked-topic/schema/asked-topic.schema';
import { User } from 'src/auth/schema/user.schema';
import { CompleteTopic } from 'src/complete-topic/schema/complete-topic.schema';
import { PendingTopic } from './schema/pending-topic.schema';

@Injectable()
export class PendingTopicService {
    constructor(
        @InjectModel('AskedTopic') private readonly askedTopicModel: Model<AskedTopic>,
        @InjectModel('PendingTopic') private readonly pendingTopicModel: Model<PendingTopic>,
        @InjectModel('CompleteTopic') private readonly completeTopicModel: Model<CompleteTopic>,
        @InjectModel('User') private readonly userModel: Model<User>,
    ){}

    ObjectId = mongoose.Types.ObjectId;
    
    async getTopics(user: User){
        const filter = { owner: user._id }
        const all_topics = await this.pendingTopicModel.find(filter)
        return all_topics
    }
    
    async getTasks(user: User) {
        const filter = { tutor: user._id}
        let all_tasks = await this.pendingTopicModel.find(filter)
        const len = all_tasks.length
        
        for(let i = 0; i < len; i++) {
            const ownerId = all_tasks[i].owner
            const theOwner = await this.userModel.findOne(ownerId)
            all_tasks[i].ownerDetails = { photo: theOwner.photo, fullname: theOwner.fullname }
        }

        return all_tasks
    }

    async startSession(user:User, topicId: string) {
        const filter = {_id : new this.ObjectId(topicId)}
        const cur_topic = await this.pendingTopicModel.findOne(filter)
        const curtime = Date.now()

        if (user._id === cur_topic.owner) {
            const update = { ownerStart: curtime }
            await this.pendingTopicModel.findOneAndUpdate(filter, update)
        }
        else{
            const update = { tutorStart: curtime }
            await this.pendingTopicModel.findOneAndUpdate(filter, update)
        }

        return
    }

    async checkStatus(user: User, topicId: string){
        const filter = {_id : new this.ObjectId(topicId)}
        const cur_topic = await this.pendingTopicModel.findOne(filter)

        if (!cur_topic){
            return { message: "Session is terminated" }
        }

        if(!cur_topic.end){
            return { message: "Session has ended" }
        }

        const curtime = Date.now()
        const realStart = Math.max(cur_topic.ownerStart, cur_topic.tutorStart)
        const elapsedTime = curtime - realStart
        const elapsedHour = elapsedTime / (3600 * 1000)

        const ownerFilter = {_id: cur_topic.owner}
        const tutorFilter = {_id: cur_topic.tutor}

        const curOwner = await this.userModel.findOne(ownerFilter);
        const curTutor = await this.userModel.findOne(tutorFilter);


        const ownerWallet = curOwner.walletBalance
        const tutFee = curTutor.tutorfee

        const moneyCheck = elapsedHour * tutFee

        if (moneyCheck > ownerWallet) {
            this.endSession(user, topicId)
        } 

    }


    async endSession(user: User, topicId: string) {
        const filter = {_id : new this.ObjectId(topicId)}
        const cur_topic = await this.pendingTopicModel.findOne(filter)
        const curtime = Date.now()

        if (cur_topic.ownerStart && cur_topic.tutorStart){
            
            const update = { end: curtime }
            await this.pendingTopicModel.findOneAndUpdate(filter, update)
            const realStart = Math.max(cur_topic.ownerStart, cur_topic.tutorStart)
            const elapsedTime = curtime - realStart

            const elapsedHour = elapsedTime / (3600 * 1000)

            await this.transferMoney(cur_topic.owner, cur_topic.tutor, elapsedHour)
        }

        const filter_topic = {_id : new this.ObjectId(topicId)}
        const topic = await this.pendingTopicModel.findOneAndDelete(filter_topic)
        const newtopic = { title: topic.title, desc: topic.desc, tag: topic.tag, owner: topic.owner, tutor: topic.tutor}
        const newCompleted = new this.completeTopicModel(newtopic);
        return await newCompleted.save();        
        
    }

    async transferMoney(ownerId, tutorId, elapsedHour){
        const ownerFilter = {_id: ownerId}
        const tutorFilter = {_id: tutorId}
        
        const curOwner = await this.userModel.findOne(ownerFilter);
        const curTutor = await this.userModel.findOne(tutorFilter);

        let moneyToTransfer = 0;

        let ownerWallet = curOwner.walletBalance
        let tutorWallet = curTutor.walletBalance
        let tutFee = curTutor.tutorfee

        moneyToTransfer = elapsedHour * tutFee
        ownerWallet -= moneyToTransfer
        tutorWallet += moneyToTransfer

        const ownerUpdate = { walletBalance: ownerWallet}
        const tutorUpdate = { walletBalance: tutorWallet}

        await this.userModel.findOneAndUpdate(ownerFilter, ownerUpdate)
        await this.userModel.findOneAndUpdate(tutorFilter, tutorUpdate)
        
    }

    async cancelSession(user: User, topicId: string){
        const filter_topic = {_id : new this.ObjectId(topicId)}
        const topic = await this.pendingTopicModel.findOneAndDelete(filter_topic)
        const newtopic = { title: topic.title, desc: topic.desc, tag: topic.tag, owner: topic.owner}
        const newAsked = new this.askedTopicModel(newtopic);
        return await newAsked.save();
    }
}
