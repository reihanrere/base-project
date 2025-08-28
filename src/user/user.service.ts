import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RoleInfo,
  UserCreateRequest,
  UserCreateResponse,
  UserResponse,
  UserUpdateRequest,
  UserUpdateResponse,
} from '../model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PaginationResponse } from '../model/pagination.model';
import { RoleResponse } from '../model/role.model';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    this.logger.debug(`Register new user ${JSON.stringify(request)}`);
    const createRequest: RegisterRequest = this.validationService.validate(
      UserValidation.REGISTER,
      request,
    );

    // check exist user
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { username: createRequest.username },
          { email: createRequest.email },
          { phoneNumber: createRequest.phoneNumber },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Username, email, or phone number already exists',
      );
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const password = await bcrypt.hash(createRequest.password, salt);

    // get role user
    const defaultRole = await this.prismaService.role.findUnique({
      where: { name: 'user' },
    });

    // register user
    const user = await this.prismaService.user.create({
      data: {
        username: createRequest.username,
        email: createRequest.email,
        phoneNumber: createRequest.phoneNumber,
        password,
        salt,
        roleId: defaultRole?.id,
      },
    });

    return {
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber ?? '',
    };
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const loginData = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    // check username or email
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: loginData.emailOrUsername },
          { username: loginData.emailOrUsername },
        ],
      },
      include: { role: true }, // include role relation
    });

    if (!user) {
      throw new UnauthorizedException('Email/Username or Password is Invalid');
    }

    // check valid password
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email/Username or Password is Invalid');
    }

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    // check role id
    const role: RoleInfo | undefined = user.role
      ? { id: user.role.id, name: user.role.name }
      : undefined;

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLogin: new Date(),
      },
    });

    return {
      token,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber ?? '',
      role,
    };
  }

  async create(request: UserCreateRequest): Promise<UserCreateResponse> {
    this.logger.debug(`Create new user ${JSON.stringify(request)}`);
    const createRequest: UserCreateRequest = this.validationService.validate(
      UserValidation.CREATE,
      request,
    );

    // check user exist
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { username: createRequest.username },
          { email: createRequest.email },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const password = await bcrypt.hash(createRequest.password, salt);

    // create user
    const user = await this.prismaService.user.create({
      data: {
        username: createRequest.username,
        email: createRequest.email,
        phoneNumber: createRequest.phoneNumber,
        fullName: createRequest.fullName,
        password,
        salt,
        roleId: createRequest.roleId,
      },
    });

    return {
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber ?? '',
      fullName: user.fullName ?? '',
      roleId: user.roleId ?? '',
    };
  }

  async update(request: UserUpdateRequest): Promise<UserUpdateResponse> {
    const updateRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    const { id, ...dataToUpdate } = updateRequest;

    this.logger.debug(
      `Update user with id: ${id} with data ${JSON.stringify(updateRequest)}`,
    );

    // check user exist
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // check duplicate user
    if (dataToUpdate.username || dataToUpdate.email) {
      const userWithSameData = await this.prismaService.user.findFirst({
        where: {
          NOT: { id },
          OR: [
            ...(dataToUpdate.username
              ? [{ username: dataToUpdate.username }]
              : []),
            ...(dataToUpdate.email ? [{ email: dataToUpdate.email }] : []),
          ],
        },
      });

      if (userWithSameData) {
        throw new ConflictException('Username or email already in use');
      }
    }

    if (dataToUpdate.password) {
      const saltRounds = 10;
      dataToUpdate.password = await bcrypt.hash(
        dataToUpdate.password,
        saltRounds,
      );
    }

    // update user
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: dataToUpdate,
    });

    return {
      username: updatedUser.username,
      email: updatedUser.email,
      fullName: updatedUser.fullName ?? '',
      phoneNumber: updatedUser.phoneNumber ?? '',
      roleId: updatedUser.roleId ?? '',
    };
  }

  async getById(id: string): Promise<UserResponse> {
    this.logger.info(`Get user with id: ${id}`);

    const user = await this.prismaService.user.findUnique({
      where: { id: id },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const role: RoleInfo | undefined = user.role
      ? { id: user.role.id, name: user.role.name }
      : undefined;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName ?? '',
      phoneNumber: user.phoneNumber ?? '',
      role: role,
      lastLogin: user.lastLogin ?? '',
      isActive: user.isActive,
      updatedAt: user.updatedAt ?? '',
      createdAt: user.createdAt ?? '',
      deletedAt: user.deletedAt ?? '',
      isDeleted: user.isDeleted,
    };
  }

  async getAll(
    page: number = 1,
    size: number = 10,
  ): Promise<PaginationResponse<UserResponse>> {
    this.logger.info(`Get user list page=${page}, size=${size}`);

    const skip = (page - 1) * size;
    const [user, total] = await Promise.all([
      this.prismaService.user.findMany({
        where: {
          isDeleted: false,
        },
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
        include: {
          role: true,
        },
      }),
      this.prismaService.user.count(),
    ]);

    const data = user.map((r) => ({
      id: r.id,
      username: r.username,
      email: r.email,
      fullName: r.fullName ?? '',
      phoneNumber: r.phoneNumber ?? '',
      role: r.role ? { id: r.role.id, name: r.role.name } : undefined,
      lastLogin: r.lastLogin ? r.lastLogin.toISOString() : '',
      isActive: r.isActive,
      updatedAt: r.updatedAt ? r.updatedAt.toISOString() : '',
      createdAt: r.createdAt ? r.createdAt.toISOString() : '',
      deletedAt: r.deletedAt ? r.deletedAt.toISOString() : '',
      isDeleted: r.isDeleted,
    }));

    return {
      data,
      page,
      size,
      total,
    };
  }

  async delete(id: string): Promise<UserResponse> {
    this.logger.info(`Delete user with id: ${id}`);
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
      },
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName ?? '',
      phoneNumber: user.phoneNumber ?? '',
      role: user.role ? { id: user.role.id, name: user.role.name } : undefined,
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : '',
      isActive: user.isActive,
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : '',
      createdAt: user.createdAt ? user.createdAt.toISOString() : '',
      deletedAt: user.deletedAt ? user.deletedAt.toISOString() : '',
      isDeleted: user.isDeleted,
    };
  }
}
