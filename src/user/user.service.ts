import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, RoleInfo } from '../model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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
    const passwordHash = await bcrypt.hash(createRequest.password, salt);

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
        passwordHash,
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
      user.passwordHash,
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

    return {
      token,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber ?? '',
      role,
    };
  }
}
