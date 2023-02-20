import * as mongoose from "mongoose";

export const PendingTopicSchema = new mongoose.Schema({
    title: { type: String, required: true},
    desc: { type: String, required: true},
    tag: { type: [String], required: true},
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
    owner: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: false },
    ownerStart: { type: Number, required: false},
    tutorStart: { type: Number, required: false},
    end: { type: Number, required: false},   
    ownerDetails: { type: Object, required: false}
})

export interface PendingTopic extends mongoose.Document {
    id: string;
    title: string;
    desc: string;
    tag: [string];
    tutor: mongoose.Schema.Types.ObjectId;
    owner: mongoose.Schema.Types.ObjectId;
    ownerStart: number;
    tutorStart: number;
    end: number;    
    ownerDetails: object;
}
