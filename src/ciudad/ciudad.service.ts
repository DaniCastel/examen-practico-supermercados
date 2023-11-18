import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { CiudadEntity } from './ciudad.entity';

@Injectable()
export class CiudadService {
  private PAISES_PERMITIDOS = ['Argentina', 'Ecuador', 'Paraguay'];

  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
  ) {}

  async findAll(): Promise<CiudadEntity[]> {
    return await this.ciudadRepository.find({
      relations: ['supermercados'],
    });
  }

  async findOne(id: string): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
      relations: ['supermercados'],
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return ciudad;
  }

  async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    if (!this.PAISES_PERMITIDOS.includes(ciudad.pais)) {
      throw new BusinessLogicException(
        'The country must be one of Argentina, Ecuador or Paraguay',
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.ciudadRepository.save(ciudad);
  }

  async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
    const ciudadPersistida: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });

    if (!ciudadPersistida)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (!this.PAISES_PERMITIDOS.includes(ciudad.pais)) {
      throw new BusinessLogicException(
        'The country must be one of Argentina, Ecuador or Paraguay',
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.ciudadRepository.save({
      ...ciudadPersistida,
      ...ciudad,
    });
  }

  async delete(id: string) {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.ciudadRepository.remove(ciudad);
  }
}
