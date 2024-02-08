import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePublicProfileDto } from './dto/update-public-profile.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('get-profile')
  getProfile(
    @Req() req: Request,
    @Res() res: Response

  ) {
    return this.userService.getProfile(req, res);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('get-public-profile')
  getPublicProfile(
    @Req() req: Request,
    @Res() res: Response

  ) {
    return this.userService.getPublicProfile(req, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get-avatar')
  getAvatar(
    @Req() req: Request,
    @Res() res: Response
  ) {
    return this.userService.getAvatar(req, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get-email')
  getEmail(
    @Req() req: Request,
    @Res() res: Response
  ) {
    return this.userService.getEmail(req, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-public-profile')
  updatePublicProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateUser: UpdatePublicProfileDto
    ) {
    return this.userService.updatePublicProfile(req, res, updateUser);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-password')
  updatePassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() update: UpdatePasswordDto
    ) {
    return this.userService.updatePassword(req, res, update);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-email')
  updateEmail(
    @Req() req: Request,
    @Res() res: Response,
    @Body() update: UpdateEmailDto
    ) {
    return this.userService.updateEmail(req, res, update);
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('delete-account')
  deleteUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: DeleteUserDto
  ) {
    return this.userService.deleteUser(req, res, data);
  }
}
