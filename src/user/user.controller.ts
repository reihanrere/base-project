import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { BaseResponse } from '../common/dto/base-response.dto';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../model/user.model';

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
}
