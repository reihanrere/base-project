import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
