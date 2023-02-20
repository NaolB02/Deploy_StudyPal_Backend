import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/auth/schema/user.schema';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    imports: [
        AuthModule, 
        PassportModule,
        MongooseModule.forFeature([{name: "User", schema: UserSchema}])
    ],
    controllers: [ProfileController],
    providers: [ProfileService]
})
export class ProfileModule {}
