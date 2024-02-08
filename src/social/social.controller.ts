import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Res } from '@nestjs/common';
import { SocialService } from './social.service';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post()
  create(@Body() createSocialDto: CreateSocialDto) {
    return this.socialService.create(createSocialDto);
  }

  @Get()
  findAll() {
    return this.socialService.findAll();
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('get')
  getSocial(
    @Req() req: Request,
    @Res() res: Response
    ) {
    return this.socialService.getSocial(req, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update')
  updateSocial(
    @Req() req: Request, 
    @Res() res:Response,
    @Body() updateSocial: UpdateSocialDto) {
    return this.socialService.updateSocial(req, res, updateSocial);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialService.remove(+id);
  }
}
