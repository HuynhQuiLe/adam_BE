import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';
import { Response } from 'express';

@Controller('creator')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Post()
  create(@Body() createCreatorDto: CreateCreatorDto) {
    return this.creatorService.create(createCreatorDto);
  }

  @Get('get-creators')
  getCreators(
    @Res() res:Response
  ) {
    return this.creatorService.getCreators(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creatorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreatorDto: UpdateCreatorDto) {
    return this.creatorService.update(+id, updateCreatorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creatorService.remove(+id);
  }
}
