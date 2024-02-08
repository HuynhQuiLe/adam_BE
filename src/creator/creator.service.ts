import {Injectable, HttpStatus, HttpException} from '@nestjs/common';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {responseData} from 'src/utils/responseData';

@Injectable()
export class CreatorService {
  prisma = new PrismaClient()

  create(createCreatorDto: CreateCreatorDto) {
    return 'This action adds a new creator';
  }

  async getCreators(res: Response) {
    try {

      const creators = await this.prisma.users.findMany({
        orderBy: {
          created_date: 'desc',
        },
        take: 4,
        select:{
          avatar:true,
          full_name: true,
          roles: true,
          country:true,
          user_id:true
        }

      });
      console.log(creators)
      if (!creators) {
        throw new HttpException('No creators were found.', HttpStatus.NOT_FOUND)
      }

      responseData(res, "Get creators successfully.", creators, HttpStatus.ACCEPTED)
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(res, exception.response  || 'An error has occurred.', null, exception.status || 400)
      }
       responseData(res, "An error has occurred - with Get creators.", null, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} creator`;
  }

  update(id: number, updateCreatorDto: UpdateCreatorDto) {
    return `This action updates a #${id} creator`;
  }

  remove(id: number) {
    return `This action removes a #${id} creator`;
  }
}
