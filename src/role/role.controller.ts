import { Controller, Post, Body, Put, Delete, Param, Get, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { BaseResponse } from '../common/dto/base-response.dto';
import {
  RoleResponse,
  RoleCreateRequest,
  RoleUpdateRequest,
} from '../model/role.model';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationResponse } from '../model/pagination.model';
import { FilterResponse } from '../model/filter.model';

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

  @Put()
  @ApiOperation({ summary: 'Update role' })
  async update(
    @Body() body: RoleUpdateRequest,
  ): Promise<BaseResponse<RoleResponse | null>> {
    try {
      const result = await this.roleService.update(body);
      return BaseResponse.success(result, 'Role updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return BaseResponse.error('Failed to update role', [message]);
    }
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<BaseResponse<RoleResponse | null>> {
    try {
      const result = await this.roleService.delete(id);
      return BaseResponse.success(result, 'Role deleted successfully');
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return BaseResponse.error('Failed to delete role', [message]);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get role list with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'size', required: false, example: 10 })
  async getAll(
    @Query('page') page = 1,
    @Query('size') size = 10,
  ): Promise<BaseResponse<PaginationResponse<RoleResponse>>> {
    try {
      const result = await this.roleService.getAll(Number(page), Number(size));
      return BaseResponse.success(result, 'Get roles successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return BaseResponse.error('Failed to get roles', [message]);
    }
  }

  @Get('filter')
  @ApiOperation({
    summary:
      'Get roles filter list, optional pagination (page=0,size=0 for all)',
  })
  @ApiQuery({ name: 'page', required: false, example: 0 })
  @ApiQuery({ name: 'size', required: false, example: 0 })
  async getFilter(
    @Query('page') page = 0,
    @Query('size') size = 0,
  ): Promise<BaseResponse<PaginationResponse<FilterResponse>>> {
    try {
      const result = await this.roleService.getFilter(
        Number(page),
        Number(size),
      );
      return BaseResponse.success(result, 'Filter roles fetched successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return BaseResponse.error('Failed to fetch filter roles', [message]);
    }
  }
}
