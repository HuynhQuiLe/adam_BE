import {Injectable, HttpStatus, HttpException} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Response } from 'express';
import {responseData} from 'src/utils/responseData';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BrandService {
  prisma = new PrismaClient()
  create(createBrandDto: CreateBrandDto) {
    return 'This action adds a new brand';
  }

  async getAllBrands(res:Response) {
    try {
      const brands = await this.prisma.brands.findMany({orderBy:{
        brand: 'asc'
      }})

      if(!brands) {
        throw new HttpException('No brand was found.', HttpStatus.NOT_FOUND)
      }
      responseData(res, "Get all brands successfully.", brands, HttpStatus.ACCEPTED)
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(res, exception.response  || 'An error has occurred.', null, exception.status || 400)
      }
       responseData(res, "An error has occurred - with Get all brands.", null, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
