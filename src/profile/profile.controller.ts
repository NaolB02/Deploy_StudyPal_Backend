import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from 'src/auth/schema/user.schema';
import { EditProfileDto } from './dto/editProfile.dto';
import { ProfileService } from './profile.service';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
    constructor( private profileServ: ProfileService){}

    @Get('view-profile')
    async viewProfile(@GetUser() user: User) {
        return await this.profileServ.viewProfile(user);
    }

    @Put('edit-profile')
    async editProfile(@GetUser() user: User, @Body() editProf: EditProfileDto) {
        return await this.profileServ.editProfile(user, editProf);
    }
}
