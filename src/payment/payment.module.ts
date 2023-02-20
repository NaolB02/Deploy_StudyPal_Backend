import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/auth/schema/user.schema';
import { TxrefSchema } from './schema/txref.schema';

@Module({
    imports: [
        AuthModule, 
        PassportModule, 
        MongooseModule.forFeature([{name: "User", schema: UserSchema}]),
        MongooseModule.forFeature([{name: "Txref", schema: TxrefSchema}]),
  ],
    providers: [PaymentService],
    controllers: [PaymentController],
})
export class PaymentModule {
    
}
