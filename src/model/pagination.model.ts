import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse<T> {
  @ApiProperty({ type: [Object], description: 'List of data' })
  data: T[] = [];

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  size: number;

  @ApiProperty({ example: 100, description: 'Total number of items' })
  total: number;
}
