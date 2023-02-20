import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { EditProfileDto } from './dto/editProfile.dto';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>
    ) {}

    async viewProfile(user: User) : Promise<User> {
        const userId = user._id
        const filter = { _id: userId }
        const profileOwner = await this.userModel.findOne(filter);
        return profileOwner
    }

    async editProfile(user: User, editProf: EditProfileDto) {
        const filter = { _id: user._id };
        const update = editProf;
        await this.userModel.findOneAndUpdate(filter, update);
        return await this.userModel.findOne(filter);
    }
}
