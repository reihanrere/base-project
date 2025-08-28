import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [CommonModule, UserModule, RoleModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
