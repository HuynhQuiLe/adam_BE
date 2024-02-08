import {Injectable, HttpStatus, HttpException} from '@nestjs/common';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { Request, Response } from 'express';
import {tokenMajors} from '../config/jwt';
import {responseData} from 'src/utils/responseData';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SocialService {
  prisma = new PrismaClient()

  create(createSocialDto: CreateSocialDto) {
    return 'This action adds a new social';
  }

  findAll() {
    return `This action returns all social`;
  }

  async getSocial(req: Request, res:Response) {
    try {
      const {authorization} = req.headers
      const token = authorization.replace('Bearer ', '')
      const { user_id}:any = tokenMajors.decodeToken(token).data;

      const user = await this.prisma.users.findFirst({where: { user_id }});
      if (!user) {
        throw new HttpException('No user was found.', HttpStatus.NOT_FOUND)
      }
  
     let social = await this.prisma.social.findFirst({where: {user_id}})
      

     if(!social) {
      const emptySocial = {
        facebook:null,
        tiktok:null,
        youtube:null,
        linkedin:null,
        twitter:null,
        instagram: null
      }
      return responseData(res, "Get user's social media successfully.", emptySocial, HttpStatus.ACCEPTED)
     }

      responseData(res, "Get user's social media successfully.", social, HttpStatus.ACCEPTED)
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(res, exception.response  || 'An error has occurred.', null, exception.status || 400)
      }
       responseData(res, "An error has occurred - with Get user's social media.", null, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateSocial(
    req: Request, 
    res: Response, 
    updateSocial: UpdateSocialDto) {
      try {
        const {authorization} = req.headers
        const token = authorization.replace('Bearer ', '')
        const { user_id }: any = tokenMajors.decodeToken(token).data;
  
        const user = await this.prisma.users.findFirst({where: { user_id }});
        if (!user) {
          throw new HttpException('No user was found.', HttpStatus.NOT_FOUND)
        }

        const social = await this.prisma.social.findFirst({where: {user_id}})


       const update = await this.prisma.social.upsert({
       where: {
        user_id
       },
        update: {
            ...social,
            ...updateSocial,
          },
        create: {
          ...updateSocial,
          user_id
        }
      })
  
        responseData(res, "Your changes have been saved.", update, HttpStatus.ACCEPTED)
      } catch (exception) {
        if (exception.status !== 500) {
          return responseData(res, exception.response  || 'An error has occurred.', null, exception.status || 400)
        }
         responseData(res, "An error has occurred - with Update user's social media.", null, HttpStatus.INTERNAL_SERVER_ERROR)
      }
  }

  remove(id: number) {
    return `This action removes a #${id} social`;
  }
}
