import {Injectable, HttpStatus, HttpException} from '@nestjs/common';
import { UpdatePublicProfileDto } from './dto/update-public-profile.dto';
import { Request, Response } from 'express';
import {tokenMajors} from '../config/jwt';
import { PrismaClient } from '@prisma/client';
import {responseData} from 'src/utils/responseData';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UserService {
  prisma = new PrismaClient

  async getProfile(req: Request, res: Response) {
    try {
      const {authorization} = req.headers
      const token = authorization.replace('Bearer ', '')
      const { user_id } :any = tokenMajors.decodeToken(token).data;

      const user = await this.prisma.users.findFirst({ where: { user_id }, select: {
        full_name: true,
        avatar: true,
        url:true,
      } });
      if (!user) {
        throw new HttpException('No user was found.', HttpStatus.NOT_FOUND)
      }

      responseData(res, "Get user profile successfully.", user, HttpStatus.ACCEPTED)
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(res, exception.response  || 'An error has occurred.', null, exception.status || 400)
      }
       responseData(res, "An error has occurred - with Get user profile .", null, HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  async getPublicProfile(req: Request, res: Response) {
    try {
      const {authorization} = req.headers
      const token = authorization.replace('Bearer ', '')
      const { user_id } :any = tokenMajors.decodeToken(token).data;

      const user = await this.prisma.users.findFirst({ 
        where: { user_id }, 
        select: {
        full_name: true,
        avatar: true,
        birthday: true,
        role_id: true,
        gender: true,
        url: true,
        country: true,
        description: true,
      },
    });
      if (!user) {
        throw new HttpException('No user was found.', HttpStatus.NOT_FOUND)
      }

      
      responseData(res, "Get uer's public profile successfully.", user, HttpStatus.ACCEPTED)
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(res, exception.response  || 'An error has occurred.', null, exception.status || 400)
      }
       responseData(res, "An error has occurred - with Get uer's public profile .", null, HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  async getAvatar(req: Request, res: Response) {
    try {
      const {authorization} = req.headers
      const token = authorization.replace('Bearer ', '')
      const { user_id } :any = tokenMajors.decodeToken(token).data;

      const user = await this.prisma.users.findFirst({ 
        where: { user_id }, 
        select: {
        avatar: true,
      },
    });
      if (!user) {
        throw new HttpException('No user was found.', HttpStatus.NOT_FOUND)
      }
      responseData(res, "Get uer's avatar successfully.", user, HttpStatus.ACCEPTED)
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(res, exception.response  || 'An error has occurred.', null, exception.status || 400)
      }
       responseData(res, "An error has occurred - with Get uer's avatar.", null, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async getEmail(req: Request, res: Response) {
    try {
      const {authorization} = req.headers
      const token = authorization.replace('Bearer ', '')
      const { user_id } :any = tokenMajors.decodeToken(token).data;

      const user = await this.prisma.users.findFirst({ 
        where: { user_id }, 
        select: {
        email: true,
      },
    });
      if (!user) {
        throw new HttpException('No user was found.', HttpStatus.NOT_FOUND)
      }
      responseData(res, "Get uer's email successfully.", user, HttpStatus.ACCEPTED)
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(res, exception.response  || 'An error has occurred.', null, exception.status || 400)
      }
       responseData(res, "An error has occurred - with Get uer's email.", null, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updatePublicProfile(req: Request, res :Response, updateUser: UpdatePublicProfileDto) {
    try {
      const {authorization} = req.headers
      const token = authorization.replace('Bearer ', '')
      const { user_id } :any = tokenMajors.decodeToken(token).data;

      const user = await this.prisma.users.findFirst({where: { user_id }});
      if (!user) {
        throw new HttpException('No user was found.', HttpStatus.NOT_FOUND)
      }

  
      await this.prisma.users.update({
        where: {
          user_id 
        },
        data: {
          ...user,
          ...updateUser
        }
      })

      responseData(res, "Your changes has been saved.", user, HttpStatus.ACCEPTED)
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(res, exception.response  || 'An error has occurred.', null, exception.status || 400)
      }
       responseData(res, "An error has occurred - with Update user public profile.", null, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async updatePassword(req: Request, res :Response, update: UpdatePasswordDto) {
    try {
      const {authorization} = req.headers
      const token = authorization.replace('Bearer ', '')
      const { user_id } :any = tokenMajors.decodeToken(token).data;

      const user = await this.prisma.users.findFirst({where: { user_id }});
      if (!user) {
        throw new HttpException('No user was found.', HttpStatus.NOT_FOUND)
      }

      await this.prisma.users.update({
        where: {
          user_id 
        },
        data: {
          ...user,
          pass_word:update.pass_word
        }
      })

      responseData(res, "Your changes has been saved.", null, HttpStatus.ACCEPTED)
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(res, exception.response  || 'An error has occurred.', null, exception.status || 400)
      }
       responseData(res, "An error has occurred - with Update password.", null, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async updateEmail(req: Request, res :Response, update: UpdateEmailDto) {
    try {
      const {authorization} = req.headers
      const token = authorization.replace('Bearer ', '')
      const { user_id } :any = tokenMajors.decodeToken(token).data;

      const user = await this.prisma.users.findFirst({where: { user_id }});
      if (!user) {
        throw new HttpException('No user was found.', HttpStatus.NOT_FOUND)
      }
      const duplicate = await this.prisma.users.findFirst({where: {email: update.email}})

      if(duplicate) {
        throw new HttpException('Email has been used.', HttpStatus.CONFLICT)
      }

      await this.prisma.users.update({
        where: {
          user_id 
        },
        data: {
          ...user,
          email:update.email
        }
      })

      responseData(res, "Your changes has been saved.", null, HttpStatus.ACCEPTED)
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(res, exception.response  || 'An error has occurred.', null, exception.status || 400)
      }
       responseData(res, "An error has occurred - with Update email.", null, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async deleteUser(req: Request, res:Response, data: DeleteUserDto) {
    try {
      const {authorization} = req.headers
      const token = authorization.replace('Bearer ', '')
      const { user_id } :any = tokenMajors.decodeToken(token).data;

      const user = await this.prisma.users.findFirst({where: { user_id }});
      console.log(user)
      if (!user) {
        throw new HttpException('No user was found.', HttpStatus.NOT_FOUND)
      }

      if(user.pass_word !== data.pass_word) {
        throw new HttpException('Incorrect password.', HttpStatus.CONFLICT)
      }

      await this.prisma.users.update({
        where: {
          user_id 
        },
        data: {
          ...user,
          deleted: true
        }
      })

      responseData(res, "Your account has been deleted.", null, HttpStatus.ACCEPTED)
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(res, exception.response  || 'An error has occurred.', null, exception.status || 400)
      }
       responseData(res, "An error has occurred - with Delete user.", null, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
