import { ApiProperty } from '@nestjs/swagger';

export class FilterResponse {
  @ApiProperty()
  label: string;

  @ApiProperty()
  value: string;

  @ApiProperty({ required: false })
  desc?: string;
}
