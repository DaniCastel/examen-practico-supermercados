import {
  Put,
  Body,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { SupermercadoDto } from '../supermercado/supermercado.dto';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
  constructor(
    private readonly ciudadSupermercadoService: CiudadSupermercadoService,
  ) {}

  @Post(':cityId/supermarkets/:supermarketId')
  async addSupermarketToCity(
    @Param('cityId') ciudadId: string,
    @Param('supermarketId') supermercadoId: string,
  ) {
    return await this.ciudadSupermercadoService.addSupermarketToCity(
      ciudadId,
      supermercadoId,
    );
  }

  @Get(':cityId/supermarkets/:supermarketId')
  async findSupermarketFromCity(
    @Param('cityId') ciudadId: string,
    @Param('supermarketId') supermercadoId: string,
  ) {
    return await this.ciudadSupermercadoService.findSupermarketFromCity(
      ciudadId,
      supermercadoId,
    );
  }

  @Get(':cityId/supermarkets')
  async findSupermarketsFromCity(@Param('cityId') ciudadId: string) {
    return await this.ciudadSupermercadoService.findSupermarketsFromCity(
      ciudadId,
    );
  }

  @Put(':cityId/supermarkets')
  async updateSupermarketsFromCity(
    @Body() supermercadosDto: SupermercadoDto[],
    @Param('cityId') ciudadId: string,
  ) {
    const supermercados = plainToInstance(SupermercadoEntity, supermercadosDto);
    return await this.ciudadSupermercadoService.updateSupermarketsFromCity(
      ciudadId,
      supermercados,
    );
  }

  @Delete(':cityId/supermarkets/:supermarketId')
  @HttpCode(204)
  async deleteSupermarketFromCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.ciudadSupermercadoService.deleteSupermarketFromCity(
      cityId,
      supermarketId,
    );
  }
}
