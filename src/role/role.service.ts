import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RoleCreateRequest, RoleResponse, RoleUpdateRequest } from '../model/role.model';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { RoleValidation } from './role.validation';
import { PaginationResponse } from '../model/pagination.model';
import { FilterResponse } from '../model/filter.model';

@Injectable()
export class RoleService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  private toRoleResponse(role: RoleResponse): RoleResponse {
    return {
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  async create(request: RoleCreateRequest): Promise<RoleResponse> {
    this.logger.info(`Create new role ${JSON.stringify(request)}`);
    const createRequest: RoleCreateRequest = this.validationService.validate(
      RoleValidation.CREATE,
      request,
    );

    // check duplicate role name
    const totalRoleWithSameName = await this.prismaService.role.count({
      where: { name: createRequest.name },
    });

    if (totalRoleWithSameName > 0) {
      throw new Error('Role name already exists');
    }

    // create role
    const role = await this.prismaService.role.create({
      data: { name: createRequest.name },
    });

    return this.toRoleResponse(role);
  }

  async update(request: RoleUpdateRequest): Promise<RoleResponse> {
    this.logger.info(`Update role: ${JSON.stringify(request)}`);

    const updateRequest = this.validationService.validate(
      RoleValidation.UPDATE,
      request,
    );

    // check role id is existed
    const role = await this.prismaService.role.findUnique({
      where: { id: updateRequest.id },
    });

    if (!role) {
      throw new NotFoundException(`Role with id ${updateRequest.id} not found`);
    }

    // check duplicate role name
    const duplicate = await this.prismaService.role.count({
      where: {
        name: updateRequest.name,
        NOT: { id: updateRequest.id },
      },
    });

    if (duplicate > 0) {
      throw new ConflictException('Role name already exists');
    }

    // update role
    const updatedRole = await this.prismaService.role.update({
      where: { id: updateRequest.id },
      data: { name: updateRequest.name },
    });

    return this.toRoleResponse(updatedRole);
  }

  async delete(id: string): Promise<RoleResponse> {
    this.logger.info(`Delete role with id: ${id}`);

    // check role is existed
    const role = await this.prismaService.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    // delete role
    const deletedRole = await this.prismaService.role.delete({
      where: { id },
    });

    return this.toRoleResponse(deletedRole);
  }

  async getAll(
    page: number = 1,
    size: number = 10,
  ): Promise<PaginationResponse<RoleResponse>> {
    this.logger.info(`Get role list page=${page}, size=${size}`);

    const skip = (page - 1) * size;
    const [roles, total] = await Promise.all([
      this.prismaService.role.findMany({
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.role.count(),
    ]);

    const data = roles.map((r) => this.toRoleResponse(r));

    return {
      data,
      page,
      size,
      total,
    };
  }

  async getFilter(
    page = 0,
    size = 0,
  ): Promise<PaginationResponse<FilterResponse>> {
    let roles: any[];
    let total: number;

    if (page <= 0 || size <= 0) {
      // full without pagination
      roles = await this.prismaService.role.findMany({
        orderBy: { name: 'asc' },
      });
      total = roles.length;
    } else {
      // with pagination
      const skip = (page - 1) * size;
      [roles, total] = await Promise.all([
        this.prismaService.role.findMany({
          skip,
          take: size,
          orderBy: { name: 'asc' },
        }),
        this.prismaService.role.count(),
      ]);
    }

    const data: FilterResponse[] = roles.map((r: RoleResponse) => ({
      label: r.name,
      value: r.id,
    }));

    return {
      data,
      page: page > 0 ? page : 1,
      size: size > 0 ? size : total,
      total,
    };
  }
}
