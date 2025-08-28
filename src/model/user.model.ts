import { ApiProperty } from '@nestjs/swagger';

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

export class UserCreateRequest {
  @ApiProperty({ example: 'username' })
  username: string;

  @ApiProperty({ example: 'email@example.com' })
  email: string;

  @ApiProperty({ example: 'password' })
  password: string;

  @ApiProperty({ example: 'full name', required: false })
  fullName?: string;

  @ApiProperty({ example: '123456789', required: false })
  phoneNumber?: string;

  @ApiProperty({ example: 'uuid-for-new-role' })
  roleId: string;
}

export class UserCreateResponse {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName?: string;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  roleId: string;
}

export class UserUpdateRequest {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'new_username', required: false })
  username?: string;

  @ApiProperty({ example: 'new_email@example.com', required: false })
  email?: string;

  @ApiProperty({ example: 'new_password', required: false })
  password?: string;

  @ApiProperty({ example: 'New Full Name', required: false })
  fullName?: string;

  @ApiProperty({ example: '9876543210', required: false })
  phoneNumber?: string;

  @ApiProperty({ example: 'uuid-for-new-role', required: false })
  roleId?: string;
}

export class UserUpdateResponse {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName?: string;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  roleId: string;
}

export class UserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ type: RoleInfo, required: false })
  role?: RoleInfo;

  @ApiProperty()
  lastLogin?: Date | string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  updatedAt: Date | string;

  @ApiProperty()
  createdAt: Date | string;

  @ApiProperty()
  deletedAt: Date | string;

  @ApiProperty()
  isDeleted: boolean;
}
