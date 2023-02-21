import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { Txref } from './schema/txref.schema';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Txref') private readonly txrefModel: Model<Txref>,
    ){}

    async deposit(amount:number , user: User){
        const arr = user.fullname.split(" ")
        const first_name = arr[0]
        const last_name = arr[1]
        
        const CHAPA_URL = "https://api.chapa.co/v1/transaction/initialize"
        const CHAPA_AUTH = 'CHASECK_TEST-DQAZSfgpeA9jV6r3TLNEICmgBhQpCQsq'

        const CALLBACK_URL = "https://deploystudypalbackend-development.up.railway.app/payment/verify-transaction/"
        const RETURN_URL = "http://localhost:4200/Profile"
        const config = {
            headers: {
                Authorization: `Bearer ${CHAPA_AUTH}`
            }
        }
        // a unique reference given to every transaction
        const TEXT_REF = "tx-studypal12345-" + Date.now()

        // form data
        const data = {
            amount, 
            currency: 'ETB',
            email: user.email,
            first_name,
            last_name,
            tx_ref: TEXT_REF,
            callback_url: CALLBACK_URL + TEXT_REF,
            return_url: RETURN_URL
        }

        const txrefCand = { txId:TEXT_REF, amount, userId: user._id}

        return await axios.post(CHAPA_URL, data, config)
            .then((response) => {
                // this.updateWallet(amount, user)
                const newTxref = new this.txrefModel(txrefCand)
                newTxref.save();
                return response.data
            })
            .catch((err) => console.log(err))
    }

    async updateWallet(change: number, userId){
        const filter = {_id: userId}
        const user = await this.userModel.findOne( filter )
        await this.userModel.findOneAndUpdate(filter, {walletBalance: user.walletBalance + change})
    }

    async verifyTransaction(id:string){
        const CHAPA_AUTH = 'CHASECK_TEST-DQAZSfgpeA9jV6r3TLNEICmgBhQpCQsq'

        const config = {
            headers: {
                Authorization: `Bearer ${CHAPA_AUTH}`
            }
        }
        
        const filter = {txId: id}
        const reqTx = await this.txrefModel.findOne(filter)
         //verify the transaction 
         await axios.get("https://api.chapa.co/v1/transaction/verify/" + id, config)
         .then((response) => {
             console.log("Payment was successfully verified")
             this.updateWallet(reqTx.amount, reqTx.userId)

         }) 
         .catch((err) => console.log("Payment can't be verfied", err))
    }

    async withdraw(user: User , account_name: string, account_number: string, amount: number, selectedBank: string) {

        const filter = { _id: user._id}
        const walletOwner = await this.userModel.findOne(filter)
        const curWallet = walletOwner.walletBalance;

        if (amount > curWallet) {
            return "Amount Exceeded"
        }

        const REF_ = "ref-studypal3478-" + Date.now()
        const CHAPA_AUTH = 'CHASECK_TEST-DQAZSfgpeA9jV6r3TLNEICmgBhQpCQsq'
        const config = {
            headers: {
                Authorization: `Bearer ${CHAPA_AUTH}`
            }
        }

        const bankList = await axios.get("https://api.chapa.co/v1/banks", config)
            .then((response) => {
                return response.data
            }) 
            .catch((err) => console.log(err))

        const len = 8
        let bank_code;

        console.log(bankList, selectedBank, len)
        console.log(typeof bankList.data)

        for(let i = 0; i < len; i++){
            if (bankList.data[i].name === selectedBank){
                bank_code = bankList.data[i].id
                break
            }
        }

        const data = {
            account_name, 
            account_number,
            amount,
            currency: 'ETB',
            reference: REF_,
            bank_code,
        }

        this.updateWallet((0 - amount), user._id)

        console.log(data)
        return await axios.post('https://api.chapa.co/v1/transfers', data, config)
            .then((response) => {
                
                return response.data
            })
            .catch((err) => console.log(err)) //log err
        

    }
}
