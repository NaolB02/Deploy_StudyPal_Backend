import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema } from './schema/user.schema';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [ 
  JwtModule.register({
    signOptions: { expiresIn: '36000' },
  }), MongooseModule.forFeature([{name:"User", schema: UserSchema}])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],  
})
export class AuthModule {}

