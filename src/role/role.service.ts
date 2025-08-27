import { Inject, Injectable } from '@nestjs/common';
import { RoleCreateRequest, RoleResponse } from '../model/role.model';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { RoleValidation } from './role.validation';

@Injectable()
export class RoleService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async create(request: RoleCreateRequest): Promise<RoleResponse> {
    this.logger.info(`Create new role ${JSON.stringify(request)}`);
    const createRequest: RoleCreateRequest = this.validationService.validate(
      RoleValidation.CREATE,
      request,
    );

    const totalRoleWithSameName = await this.prismaService.role.count({
      where: { name: createRequest.name },
    });

    if (totalRoleWithSameName > 0) {
      throw new Error('Role name already exists');
    }

    const role = await this.prismaService.role.create({
      data: { name: createRequest.name },
    });

    return {
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
