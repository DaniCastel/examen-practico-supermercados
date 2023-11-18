import { Module } from '@nestjs/common';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CiudadSupermercadoController } from './ciudad-supermercado.controller';

@Module({
  providers: [CiudadSupermercadoService],
  imports: [TypeOrmModule.forFeature([SupermercadoEntity, CiudadEntity])],
  controllers: [CiudadSupermercadoController],
})
export class CiudadSupermercadoModule {}
