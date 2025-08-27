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
  @ApiProperty({ example: 'Name' })
  name: string;
}

export class RoleUpdateRequest {
  @ApiProperty({ example: '123456' })
  id: string;
  @ApiProperty({ example: 'Name' })
  name: string;
}
