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

import { SupermercadoDto } from './supermercado.dto';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
  constructor(private readonly supermercadoService: SupermercadoService) {}

  @Get()
  async findAll() {
    return await this.supermercadoService.findAll();
  }

  @Get(':supermarketId')
  async findOne(@Param('supermarketId') supermercadoId: string) {
    return await this.supermercadoService.findOne(supermercadoId);
  }

  @Post()
  async create(@Body() supermercadoDto: SupermercadoDto) {
    const parsedSupermercadoDto = plainToInstance(
      SupermercadoDto,
      supermercadoDto,
    );
    return await this.supermercadoService.create(
      plainToInstance(SupermercadoEntity, parsedSupermercadoDto),
    );
  }

  @Put(':supermarketId')
  async update(
    @Param('supermarketId') supermercadoId: string,
    @Body() supermercadoDto: SupermercadoDto,
  ) {
    const parsedSupermercadoDto = plainToInstance(
      SupermercadoDto,
      supermercadoDto,
    );
    return await this.supermercadoService.update(
      supermercadoId,
      plainToInstance(SupermercadoEntity, parsedSupermercadoDto),
    );
  }

  @Delete(':supermarketId')
  @HttpCode(204)
  async delete(@Param('supermarketId') supermarketId: string) {
    return await this.supermercadoService.delete(supermarketId);
  }
}
