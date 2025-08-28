import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Patch,
  Post, Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { BaseResponse } from '../common/dto/base-response.dto';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserCreateRequest,
  UserCreateResponse,
  UserResponse,
  UserUpdateRequest,
  UserUpdateResponse,
} from '../model/user.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationResponse } from '../model/pagination.model';
import { RoleResponse } from '../model/role.model';

@ApiTags('Users')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register User' })
  async register(
    @Body() body: RegisterRequest,
  ): Promise<BaseResponse<RegisterResponse>> {
    try {
      const result = await this.userService.register(body);
      return BaseResponse.success(result, 'User registered successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return BaseResponse.error('Failed to register user', [message]);
    }
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login user with email or username' })
  async login(
    @Body() body: LoginRequest,
  ): Promise<BaseResponse<LoginResponse>> {
    try {
      const result = await this.userService.login(body);
      return BaseResponse.success(result, 'Login successful');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return BaseResponse.error('Login failed', [message]);
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create User' })
  async create(
    @Body() body: UserCreateRequest,
  ): Promise<BaseResponse<UserCreateResponse>> {
    try {
      const result = await this.userService.create(body);
      return BaseResponse.success(result, 'Create user successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return BaseResponse.error('Failed to create user', [message]);
    }
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update User by ID provided in body' })
  async update(
    @Body() body: UserUpdateRequest,
  ): Promise<BaseResponse<UserUpdateResponse>> {
    try {
      const result = await this.userService.update(body);
      return BaseResponse.success(result, 'User updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return BaseResponse.error('Failed to update user', [message]);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by id' })
  async getById(@Param('id') id: string): Promise<BaseResponse<UserResponse>> {
    try {
      const result = await this.userService.getById(id);
      return BaseResponse.success(result, 'Get user successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return BaseResponse.error('Failed to get user', [message]);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user list with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'size', required: false, example: 10 })
  async getAll(
    @Query('page') page = 1,
    @Query('size') size = 10,
  ): Promise<BaseResponse<PaginationResponse<UserResponse>>> {
    try {
      const result = await this.userService.getAll(Number(page), Number(size));
      return BaseResponse.success(result, 'Get users successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return BaseResponse.error('Failed to get users', [message]);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user by id' })
  async delete(@Param('id') id: string): Promise<BaseResponse<UserResponse>> {
    try {
      const result = await this.userService.delete(id);
      return BaseResponse.success(result, 'User deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return BaseResponse.error('Failed to delete user', [message]);
    }
  }
}
