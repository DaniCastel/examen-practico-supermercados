import { Module } from '@nestjs/common';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';

@Module({
  providers: [CiudadSupermercadoService],
  imports: [TypeOrmModule.forFeature([SupermercadoEntity, CiudadEntity])],
})
export class CiudadSupermercadoModule {}
