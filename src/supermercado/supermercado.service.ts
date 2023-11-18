import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { SupermercadoEntity } from './supermercado.entity';

@Injectable()
export class SupermercadoService {
  constructor(
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,
  ) {}

  async findAll(): Promise<SupermercadoEntity[]> {
    return await this.supermercadoRepository.find({
      relations: ['ciudades'],
    });
  }

  async findOne(id: string): Promise<SupermercadoEntity> {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
        relations: ['ciudades'],
      });
    if (!supermercado)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return supermercado;
  }

  async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
    if (supermercado.nombre.length <= 10) {
      throw new BusinessLogicException(
        'The supermarket name must be have at least 11 characters',
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.supermercadoRepository.save(supermercado);
  }

  async update(
    id: string,
    supermercado: SupermercadoEntity,
  ): Promise<SupermercadoEntity> {
    const supermercadoPersistido: SupermercadoEntity =
      await this.supermercadoRepository.findOne({ where: { id } });

    if (!supermercadoPersistido)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (supermercado.nombre.length <= 10) {
      throw new BusinessLogicException(
        'The supermarket name must be have at least 11 characters',
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.supermercadoRepository.save({
      ...supermercadoPersistido,
      ...supermercado,
    });
  }

  async delete(id: string) {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
      });
    if (!supermercado)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.supermercadoRepository.remove(supermercado);
  }
}
