import * as mongoose from "mongoose";

export const TxrefSchema = new mongoose.Schema({
    txId: { type: String, required: true },
    amount: { type: Number, required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, required: true}
})

export interface Txref extends mongoose.Document {
    id: string;
    txId: string;
    amount: number;
    userId: mongoose.Schema.Types.ObjectId;
}