import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [CommonModule, UserModule, RoleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
