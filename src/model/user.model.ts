import { ApiProperty } from '@nestjs/swagger';
import { RoleResponse } from './role.model';

export class RegisterRequest {
  @ApiProperty({ example: 'username' })
  username: string;

  @ApiProperty({ example: 'email@example.com' })
  email: string;

  @ApiProperty({ example: 'secret' })
  password: string;

  @ApiProperty({ example: '0123456789' })
  phoneNumber: string;
}

export class RegisterResponse {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;
}

export class LoginRequest {
  @ApiProperty({ example: 'user@example.com or username' })
  emailOrUsername: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}

export class RoleInfo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class LoginResponse {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  fullName?: string;

  @ApiProperty({ required: false })
  phoneNumber?: string;

  @ApiProperty()
  token: string;

  @ApiProperty({ type: RoleInfo, required: false })
  role?: RoleInfo;
}

export class UserCreateRequest {}

export class UserCreateResponse {}
