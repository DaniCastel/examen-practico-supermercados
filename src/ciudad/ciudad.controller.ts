import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CiudadDto } from './ciudad.dto';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
  constructor(private readonly ciudadService: CiudadService) {}

  @Get()
  async findAll() {
    return await this.ciudadService.findAll();
  }

  @Get(':cityId')
  async findOne(@Param('cityId') ciudadId: string) {
    return await this.ciudadService.findOne(ciudadId);
  }

  @Post()
  async create(@Body() ciudadDto: CiudadDto) {
    const parsedCiudadDto = plainToInstance(CiudadDto, ciudadDto);
    return await this.ciudadService.create(
      plainToInstance(CiudadEntity, parsedCiudadDto),
    );
  }

  @Put(':cityId')
  async update(@Param('cityId') cityId: string, @Body() ciudadDto: CiudadDto) {
    const parsedCiudadDto = plainToInstance(CiudadDto, ciudadDto);
    return await this.ciudadService.update(
      cityId,
      plainToInstance(CiudadEntity, parsedCiudadDto),
    );
  }

  @Delete(':cityId')
  @HttpCode(204)
  async delete(@Param('cityId') cityId: string) {
    return await this.ciudadService.delete(cityId);
  }
}
