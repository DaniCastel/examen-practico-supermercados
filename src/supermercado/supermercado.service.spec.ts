/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let listaSupermercados;

  const seedDatabase = async () => {
    repository.clear();
    listaSupermercados = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await repository.save({
        nombre: faker.word.noun({ length: 11 }),
        longitud: faker.number.int(),
        latitud: faker.number.int(),
        paginaWeb: faker.internet.url(),
      });
      listaSupermercados.push(supermercado);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(listaSupermercados.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const supermercadoAlmacenado: SupermercadoEntity = listaSupermercados[0];
    const supermercado: SupermercadoEntity = await service.findOne(
      supermercadoAlmacenado.id,
    );
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(supermercadoAlmacenado.nombre);
    expect(supermercado.latitud).toEqual(supermercadoAlmacenado.latitud);
    expect(supermercado.longitud).toEqual(supermercadoAlmacenado.longitud);
    expect(supermercado.paginaWeb).toEqual(supermercadoAlmacenado.paginaWeb);
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('create should return a new supermarket', async () => {
    const supermercado: SupermercadoEntity = {
      id: '',
      nombre: faker.word.noun({ length: 11 }),
      longitud: faker.number.int(),
      latitud: faker.number.int(),
      paginaWeb: faker.internet.url(),
    } as unknown as SupermercadoEntity;

    const nuevoSupermercado: SupermercadoEntity =
      await service.create(supermercado);
    expect(nuevoSupermercado).not.toBeNull();

    const supermercadoAlmacenado: SupermercadoEntity = await repository.findOne(
      {
        where: { id: nuevoSupermercado.id },
      },
    );
    expect(supermercadoAlmacenado).not.toBeNull();
    expect(supermercadoAlmacenado.nombre).toEqual(nuevoSupermercado.nombre);
    expect(supermercadoAlmacenado.latitud).toEqual(nuevoSupermercado.latitud);
    expect(supermercadoAlmacenado.longitud).toEqual(nuevoSupermercado.longitud);
    expect(supermercadoAlmacenado.paginaWeb).toEqual(
      nuevoSupermercado.paginaWeb,
    );
  });

  it('create should throw if name length is lower than 11', async () => {
    const supermercado: SupermercadoEntity = {
      id: '',
      nombre: faker.word.noun({ length: 7 }),
      longitud: faker.number.int(),
      latitud: faker.number.int(),
      paginaWeb: faker.internet.url(),
    } as unknown as SupermercadoEntity;

    await expect(() => service.create(supermercado)).rejects.toHaveProperty(
      'message',
      'The supermarket name must be have at least 11 characters',
    );
  });

  it('update should modify a supermarket', async () => {
    const supermercado: SupermercadoEntity = listaSupermercados[0];
    supermercado.nombre = 'New name greater than 10 characters';
    const supermercadoActualizado: SupermercadoEntity = await service.update(
      supermercado.id,
      supermercado,
    );
    expect(supermercadoActualizado).not.toBeNull();
    const supermercadoAlmacenado: SupermercadoEntity = await repository.findOne(
      {
        where: { id: supermercado.id },
      },
    );
    expect(supermercadoAlmacenado).not.toBeNull();
    expect(supermercadoAlmacenado.nombre).toEqual(supermercado.nombre);
  });

  it('update should throw if name length is less than 11', async () => {
    const supermercado: SupermercadoEntity = listaSupermercados[0];
    supermercado.nombre = 'Fallo';

    await expect(() =>
      service.update(supermercado.id, supermercado),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket name must be have at least 11 characters',
    );
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    let supermercado: SupermercadoEntity = listaSupermercados[0];
    supermercado = {
      ...supermercado,
      nombre: 'New name greater than 11 characters',
    };
    await expect(() =>
      service.update('0', supermercado),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('delete should remove a supermarket', async () => {
    const supermercado: SupermercadoEntity = listaSupermercados[0];
    await service.delete(supermercado.id);
    const supermercadoEliminado: SupermercadoEntity = await repository.findOne({
      where: { id: supermercado.id },
    });
    expect(supermercadoEliminado).toBeNull();
  });

  it('delete should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });
});
