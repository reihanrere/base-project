import { ApiProperty } from '@nestjs/swagger';

export class RoleResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class RoleCreateRequest {
  @ApiProperty({ example: 'Admin' })
  name: string;
}

export class RoleUpdateRequest {
  id: string;
  name: string;
}
