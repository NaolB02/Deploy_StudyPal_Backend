import * as mongoose from "mongoose";

export const CompleteTopicSchema = new mongoose.Schema({
    title: { type: String, required: true},
    desc: { type: String, required: true},
    tag: { type: [String], required: true},
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
    owner: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: false }
})

export interface CompleteTopic extends mongoose.Document {
    id: string;
    title: string;
    desc: string;
    tag: [string];
    tutor: mongoose.Schema.Types.ObjectId;
    owner: mongoose.Schema.Types.ObjectId;
}
