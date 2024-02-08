import {Injectable, HttpStatus, HttpException} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {tokenMajors} from '../config/jwt';
import { responseData } from 'src/utils/responseData';

@Injectable()
export class RoleService {
  prisma = new PrismaClient

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async getAllRoles(res:Response) {
    try {
      const roles = await this.prisma.roles.findMany()

      if(!roles) {
        throw new HttpException('No role was found.', HttpStatus.NOT_FOUND)
      }
      responseData(res, "Get all roles successfully.", roles, HttpStatus.ACCEPTED)
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(res, exception.response  || 'An error has occurred.', null, exception.status || 400)
      }
       responseData(res, "An error has occurred - with Get all roles.", null, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
