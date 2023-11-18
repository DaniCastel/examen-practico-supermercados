import { Module } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoEntity } from './supermercado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [SupermercadoService],
  imports: [TypeOrmModule.forFeature([SupermercadoEntity])],
})
export class SupermercadoModule {}
