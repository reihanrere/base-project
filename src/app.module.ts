import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CommonModule, UserModule, RoleModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
