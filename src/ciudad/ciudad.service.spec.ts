/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let listaCiudades;

  const seedDatabase = async () => {
    repository.clear();
    listaCiudades = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.location.city(),
        pais: 'Ecuador',
        numeroHabitantes: faker.number.int(),
      });
      listaCiudades.push(ciudad);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(listaCiudades.length);
  });

  it('findOne should return a city by id', async () => {
    const ciudadAlmacenada: CiudadEntity = listaCiudades[0];
    const ciudad: CiudadEntity = await service.findOne(ciudadAlmacenada.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(ciudadAlmacenada.nombre);
    expect(ciudad.numeroHabitantes).toEqual(ciudadAlmacenada.numeroHabitantes);
    expect(ciudad.pais).toEqual(ciudadAlmacenada.pais);
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('create should return a new city', async () => {
    const ciudad: CiudadEntity = {
      id: '',
      nombre: faker.location.city(),
      pais: 'Ecuador',
      numeroHabitantes: faker.number.int(),
    } as unknown as CiudadEntity;

    const nuevaCiudad: CiudadEntity = await service.create(ciudad);
    expect(nuevaCiudad).not.toBeNull();

    const ciudadAlmacenada: CiudadEntity = await repository.findOne({
      where: { id: nuevaCiudad.id },
    });
    expect(ciudadAlmacenada).not.toBeNull();
    expect(ciudadAlmacenada.nombre).toEqual(nuevaCiudad.nombre);
    expect(ciudadAlmacenada.numeroHabitantes).toEqual(
      nuevaCiudad.numeroHabitantes,
    );
    expect(ciudadAlmacenada.pais).toEqual(nuevaCiudad.pais);
  });

  it('create should throw if country is not Argentina, Ecuador nor Paraguay', async () => {
    const ciudad: CiudadEntity = {
      id: '',
      nombre: faker.location.city(),
      pais: 'Francia',
      numeroHabitantes: faker.number.int(),
    } as unknown as CiudadEntity;

    await expect(() => service.create(ciudad)).rejects.toHaveProperty(
      'message',
      'The country must be one of Argentina, Ecuador or Paraguay',
    );
  });

  it('update should modify a city', async () => {
    const ciudad: CiudadEntity = listaCiudades[0];
    ciudad.nombre = 'New name';
    const ciudadActualizada: CiudadEntity = await service.update(
      ciudad.id,
      ciudad,
    );
    expect(ciudadActualizada).not.toBeNull();
    const ciudadAlmacenada: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(ciudadAlmacenada).not.toBeNull();
    expect(ciudadAlmacenada.nombre).toEqual(ciudad.nombre);
  });

  it('update should throw if country is not Argentina, Ecuador nor Paraguay', async () => {
    const ciudad: CiudadEntity = listaCiudades[0];
    ciudad.pais = 'Francia';

    await expect(() =>
      service.update(ciudad.id, ciudad),
    ).rejects.toHaveProperty(
      'message',
      'The country must be one of Argentina, Ecuador or Paraguay',
    );
  });

  it('update should throw an exception for an invalid city', async () => {
    let ciudad: CiudadEntity = listaCiudades[0];
    ciudad = {
      ...ciudad,
      nombre: 'New name',
    };
    await expect(() => service.update('0', ciudad)).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('delete should remove a city', async () => {
    const ciudad: CiudadEntity = listaCiudades[0];
    await service.delete(ciudad.id);
    const ciudadEliminada: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(ciudadEliminada).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
});
