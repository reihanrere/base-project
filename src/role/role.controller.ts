import { Controller, Post, Body } from '@nestjs/common';
import { RoleService } from './role.service';
import { BaseResponse } from '../common/dto/base-response.dto';
import { RoleResponse, RoleCreateRequest } from '../model/role.model';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Role')
@Controller('/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create role' })
  async create(
    @Body() body: RoleCreateRequest,
  ): Promise<BaseResponse<RoleResponse | null>> {
    try {
      const result = await this.roleService.create(body);
      return BaseResponse.success(result, 'Role created successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return BaseResponse.error('Failed to create role', [message]);
    }
  }
}
