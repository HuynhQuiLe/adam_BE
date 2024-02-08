import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UseGuards, Next } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { NextFunction, Request, Response } from 'express';
import { LoginDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import {tokenMajors} from '../config/jwt';
import { RegisterCheckDuplicateDto } from './dto/register-check-duplicate-auth.dto';
import { VerificationCreateDto } from './dto/verification-create.dto';
import { VerificationCheckDto } from './dto/verification-check.dto';
import { VerificationUpdateDto } from './dto/verification-update.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // REGISTER
  @Post('register')
  register(
    @Res() res:Response,
    @Body() user: RegisterDto
  ) {
    return this.authService.register(res, user);
  }

  // REGISTER - check duplicate email and full name
  @Post('register-check-duplicate')
  registerCheckDuplicate(
    @Res() res:Response,
    @Body() user: RegisterCheckDuplicateDto
  ) {
    return this.authService.registerCheckDuplicate(res, user)
  }

  

  @Post('verification-check')
  verificationCheck(
    @Res() res:Response,
    @Body() verification: VerificationCheckDto
  ) {
    return this.authService.verificationCheck(res, verification)
  }

  @Post('verification-create')
  verificationCreate(
    @Res() res:Response,
    @Body() verification: VerificationCreateDto
  ) {
    return this.authService.verificationCreate(res, verification)
  }

  @Patch('verification-update')
  verificationUpdate(
    @Res() res:Response,
    @Body() code_id: VerificationUpdateDto
  ) {
    return this.authService.verificationUpdate(res, code_id)
  }

  // LOGIN
  @Post('login')
  login(
    @Res() res:Response,
    @Body() user: LoginDto
  ) {
    return this.authService.login(res, user);
  }

  // LOGOUT
  // @UseGuards(AuthGuard('jwt'))   => thnag nay khon lay duoc TokenExpiredError
  @Post('logout')
  async logout(
    @Req() req:Request,
    @Res() res:Response,
  ) {
    return this.authService.logout(req, res);
  }

  @Post('refresh-token')
  async refresh(
    @Req() req:Request,
    @Res() res:Response,
  ) {
    return this.authService.refreshToken(req, res)
  }

}
