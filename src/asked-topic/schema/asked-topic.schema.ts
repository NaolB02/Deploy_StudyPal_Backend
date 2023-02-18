import * as mongoose from "mongoose";

export const AskedTopicSchema = new mongoose.Schema({
    title: { type: String, required: true},
    desc: { type: String, required: true},
    tag: { type: [String], required: true},
    applicants: {type: [mongoose.Schema.Types.ObjectId], ref: 'User', required: true, default: []},
    owner: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: false }
})

export interface AskedTopic extends mongoose.Document {
    id: mongoose.Schema.Types.ObjectId;
    title: string;
    desc: string;
    tag: [string];
    applicants: [mongoose.Schema.Types.ObjectId];
    owner: mongoose.Schema.Types.ObjectId;
}
