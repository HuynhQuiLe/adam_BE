import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import {  PrismaClient} from '@prisma/client';
import { responseData } from 'src/utils/responseData';
import { NextFunction, Request, Response } from 'express';
import { LoginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {tokenMajors} from '../config/jwt';
import { RegisterCheckDuplicateDto } from './dto/register-check-duplicate-auth.dto';
import { VerificationCreateDto } from './dto/verification-create.dto';
import { VerificationCheckDto } from './dto/verification-check.dto';
import { VerificationUpdateDto } from './dto/verification-update.dto';


@Injectable()
export class AuthService {
  constructor ( 
    
    private jwtService: JwtService,
    private configService: ConfigService
    
  ){

  }
   prisma = new PrismaClient()

// REGISTER
 async register(res:Response ,user: RegisterDto) {
  try {
    const duplicated = await this.prisma.users.findFirst({where: {email: user.email}})
    if(duplicated) {
      throw new HttpException('Email has been used.', HttpStatus.CONFLICT)
    }

    let registerUser = {
      ...user,
      avatar: null,
      birthday: null,
      created_date: new Date(),
      role_id: 3,
      gender: 'NAM',
      refresh_token: null   
    }
  
    await this.prisma.users.create({ data:registerUser})
    responseData(res, "Sign up successfully.", null, HttpStatus.CREATED)

  } catch (exception) {
    if (exception.status !== 500) {
      return responseData(res, exception.response || 'An error has occurred.', null, exception.status || 400)
    }
     responseData(res, "An error has occurred - with sign up function.", null, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}


// REGISTER CHECK DUPLICATE
async registerCheckDuplicate(res:Response ,user: RegisterCheckDuplicateDto) {
  try {
    console.log(user.email)
    const duplicatedEmail = await this.prisma.users.findFirst({where: {email: user.email}})
    if(duplicatedEmail) {
      throw new HttpException('Email has been used.', HttpStatus.CONFLICT)
    }

    responseData(res, "There is no duplication.", true, HttpStatus.OK)

  } catch (exception) {
    if (exception.status !== 500) {
      return responseData(res, exception.response || 'An error has occurred.', null, exception.status || 400)
    }
     responseData(res, "An error has occurred - with check duplication function.", null, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}



// VERIFICATION CREATE CODE
async verificationCreate(res:Response ,verification: VerificationCreateDto) {
  try {
    
    const newVerify = {
      ...verification,
      created_date: new Date(),
	    verified: false
    }

    await this.prisma.code_verification.create({data:newVerify})

    responseData(res, "Create verification code successfully", true, HttpStatus.OK)

  } catch (exception) {
    if (exception.status !== 500) {
      return responseData(res, exception.response || 'An error has occurred.', null, exception.status || 400)
    }
     responseData(res, "An error has occurred - with Create verification code.", null, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}


// VERIFICATION CHECK CODE
async verificationCheck(res:Response ,verification: VerificationCheckDto) {
  try {
    const {email, code_key} = verification

    const found = await this.prisma.code_verification.findFirst({where: {email}})
    if(!found) {
      throw new HttpException('No code verification was found.', HttpStatus.NOT_FOUND)
    }
   
    // check
    if(found.code_key === code_key) {
      responseData(res, "Correct verification code", {code_id:found.code_id}, HttpStatus.OK)
    } else {
      throw new HttpException('Incorrect verification code.', HttpStatus.CONFLICT)
    }

  } catch (exception) {
    if (exception.status !== 500) {
      return responseData(res, exception.response || 'An error has occurred.', null, exception.status || 400)
    }
     responseData(res, "An error has occurred - with Get verification code.", null, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

// VERIFICATION UPDATE CODE
async verificationUpdate(res:Response , code_id: VerificationUpdateDto) {
  try {
    const {code_id: id} = code_id

    const found = await this.prisma.code_verification.findFirst({where: {code_id: id}})
    if(!found) {
      throw new HttpException('No verification was found.', HttpStatus.NOT_FOUND)
    }
   
    await this.prisma.code_verification.update({
      where: {
        code_id: id
      },
      data: {
        ...found,
        verified: true
      }
    })

    responseData(res, "Update verification code successfully", null, HttpStatus.OK)

  } catch (exception) {
    if (exception.status !== 500) {
      return responseData(res, exception.response || 'An error has occurred.', null, exception.status || 400)
    }
     responseData(res, "An error has occurred - with Update verification code.", null, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}



// LOGIN
  async login(res: Response, user:LoginDto) {
    try {
      // KIEM TRA EMAIL
      const foundUser = await this.prisma.users.findFirst({where: {email: user.email}})
      if(!foundUser) {
        throw new HttpException('Email does not exist.', HttpStatus.NOT_FOUND)
      }

      if(foundUser.deleted) {
        throw new HttpException('Your account has been deleted.', HttpStatus.NOT_ACCEPTABLE)
      }


      // KIEM TRA PASSWORD
      if(foundUser.pass_word !== user.pass_word) {
        throw new HttpException('Incorrect password.', HttpStatus.NOT_ACCEPTABLE)
      }

     
      // THANH CONG => TAO TOKEN => GUI CHO USER
      const key = new Date().getTime()

      const token = await this.jwtService.sign({data: {user_id: foundUser.user_id, key}}, {
        expiresIn: '10m', secret: this.configService.get('SECRET_KEY_TOKEN')
      })

      // TAO REFRESH USER VA CAP NHAT VAO DATABASE
      const refresh_token = await this.jwtService.sign({data:{user_id: foundUser.user_id,key}}, {
        expiresIn: '7d', secret: this.configService.get("SECRET_KEY_REF_TOKEN")
      })

      await this.prisma.users.update({data: {...foundUser, refresh_token}, where: {user_id: foundUser.user_id}} )


      responseData(res, "Log in successfully.", token, HttpStatus.ACCEPTED)
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(res, exception.response  || 'An error has occurred.', null, exception.status || 400)
      }
       responseData(res, "An error has occurred - with log in function .", null, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  // LOGOUT
  async logout(req:Request ,res:Response) {
    let {authorization} = req.headers
    const token = authorization.replace('Bearer ', '')
    const checkedToken:any = tokenMajors.checkToken(token);
    if (!checkedToken) {
      try {
        const {user_id} = this.jwtService.decode(token).data
        const user = await this.prisma.users.findFirst({where: {user_id}})    
        // SET REFRESH TOKEN THANH NULL
        await this.prisma.users.update({data: {...user, refresh_token: null}, where:{user_id}})
        responseData(res, "Log out successfully.", null, HttpStatus.OK)
    
      } catch (exception) {
        if (exception.status !== 500) {
          return responseData(res, exception.response  || 'An error has occurred', null, exception.status || 400)
        }
        responseData(res, "An error has occurred - with log out function.", null, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    } else {
      return responseData(
        res,
        "Unauthorized - Bạn Không có quyền truy cập",
        checkedToken.name,
        401
      );
    }
  }


  // REFRESHTOKEN 

  async refreshToken (req:Request ,res:Response) {
    try {
      let {authorization} = req.headers
      const token = authorization.replace('Bearer ', '')
      if(token === 'null') {
        return responseData(
          res,
          "Not Authorized! - YOU ARE NOT ALLOWED TO ACCESS.",
          null,
          403
        );
      }


      //check token
      const checkedToken:any = tokenMajors.checkToken(token);
      if (checkedToken && checkedToken.name !== "TokenExpiredError") {
        return responseData(
          res,
          "Not Authorized! - Token is not legal.",
          checkedToken.name,
          401
        );
      }

      // lay ta refresh token
      const { user_id, key } :any = tokenMajors.decodeToken(token).data;
      const user = await this.prisma.users.findFirst({ where: { user_id } });
      const { refresh_token } = user;

      // check refresh token
      const checkedRefToken:any = tokenMajors.checkRefToken(refresh_token);

      if (checkedRefToken && checkedRefToken.name !== "TokenExpiredError") {
        return responseData(
          res,
          "Not Authorized! - Refresh Token không hợp lệ",
          checkedToken.name,
          401
        );
      }

      // refresh token out of date => login again
      if (checkedRefToken && checkedRefToken.name === "TokenExpiredError") {
        return responseData(res, "LOGIN_AGAIN", checkedToken.name, 401);
      }

      const { key: refKey } :any = tokenMajors.decodeToken(refresh_token).data;

      if (key !== refKey) {
        return responseData(
          res,
          "Not Authorized! - Account has been logged in another places.",
          checkedToken.name,
          409
        );
      }

      //create new token

      const newToken = await this.jwtService.sign({data: {user_id: user.user_id, key: refKey}}, {
        expiresIn: '10m', secret: this.configService.get('SECRET_KEY_TOKEN')
      })

      responseData(res, "Tạo mới token thành công", newToken, 201);
    } catch (error) {
      responseData(res, "Đã có lỗi xảy ra với refesh token", null, 400);
    }
  }
}

