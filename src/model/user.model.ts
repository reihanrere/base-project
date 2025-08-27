import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequest {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;
}

export class RegisterResponse {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;
}

export class UserCreateRequest {}

export class UserCreateResponse {}
