import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let listaSupermercados: SupermercadoEntity[];

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();

    listaSupermercados = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity =
        await supermercadoRepository.save({
          nombre: faker.word.noun({ length: 11 }),
          longitud: faker.number.int(),
          latitud: faker.number.int(),
          paginaWeb: faker.internet.url(),
        });
      listaSupermercados.push(supermercado);
    }

    ciudad = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: 'Ecuador',
      numeroHabitantes: faker.number.int(),
      supermercados: listaSupermercados,
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findSupermarketFromCity should return supermarket by city', async () => {
    const supermercado: SupermercadoEntity = listaSupermercados[0];
    const supermercadoAlmacenado: SupermercadoEntity =
      await service.findSupermarketFromCity(ciudad.id, supermercado.id);
    expect(supermercadoAlmacenado).not.toBeNull();
    expect(supermercadoAlmacenado.nombre).toBe(supermercado.nombre);
    expect(supermercadoAlmacenado.latitud).toBe(supermercado.latitud);
    expect(supermercadoAlmacenado.longitud).toBe(supermercado.longitud);
    expect(supermercadoAlmacenado.paginaWeb).toBe(supermercado.paginaWeb);
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(() =>
      service.findSupermarketFromCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('findSupermarketFromCity should throw an exception for an invalid city', async () => {
    const supermarket: SupermercadoEntity = listaSupermercados[0];
    await expect(() =>
      service.findSupermarketFromCity('0', supermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('findSupermarketFromCity should throw an exception for a supermarket not associated to the city', async () => {
    const nuevoSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.word.noun({ length: 11 }),
        longitud: faker.number.int(),
        latitud: faker.number.int(),
        paginaWeb: faker.internet.url(),
      });

    await expect(() =>
      service.findSupermarketFromCity(ciudad.id, nuevoSupermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id is not associated to the city',
    );
  });

  it('findSupermarketsFromCity should return recipes by city', async () => {
    const supermercado: SupermercadoEntity[] =
      await service.findSupermarketsFromCity(ciudad.id);
    expect(supermercado.length).toBe(5);
  });

  it('findSupermarketsFromCity should throw an exception for an invalid city', async () => {
    await expect(() =>
      service.findSupermarketsFromCity('0'),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('updateSupermarketsFromCity should update supermarket list for a city', async () => {
    const nuevoSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.word.noun({ length: 11 }),
        longitud: faker.number.int(),
        latitud: faker.number.int(),
        paginaWeb: faker.internet.url(),
      });

    const ciudadActualizada: CiudadEntity =
      await service.updateSupermarketsFromCity(ciudad.id, [nuevoSupermercado]);
    expect(ciudadActualizada.supermercados.length).toBe(1);

    expect(ciudadActualizada.supermercados[0].nombre).toBe(
      nuevoSupermercado.nombre,
    );
    expect(ciudadActualizada.supermercados[0].longitud).toBe(
      nuevoSupermercado.longitud,
    );
    expect(ciudadActualizada.supermercados[0].latitud).toBe(
      nuevoSupermercado.latitud,
    );
    expect(ciudadActualizada.supermercados[0].paginaWeb).toBe(
      nuevoSupermercado.paginaWeb,
    );
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid city', async () => {
    const nuevoSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.word.noun({ length: 11 }),
        longitud: faker.number.int(),
        latitud: faker.number.int(),
        paginaWeb: faker.internet.url(),
      });

    await expect(() =>
      service.updateSupermarketsFromCity('0', [nuevoSupermercado]),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid supermarket', async () => {
    const nuevoSupermercado: SupermercadoEntity = listaSupermercados[0];
    nuevoSupermercado.id = '0';

    await expect(() =>
      service.updateSupermarketsFromCity(ciudad.id, [nuevoSupermercado]),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('deleteSupermarketFromCity should remove a supermarket from a city', async () => {
    const supermercado: SupermercadoEntity = listaSupermercados[0];

    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);

    const ciudadAlmacenada: CiudadEntity = await ciudadRepository.findOne({
      where: { id: ciudad.id },
      relations: ['supermercados'],
    });
    const supermercadoEliminado: SupermercadoEntity =
      ciudadAlmacenada.supermercados.find((a) => a.id === supermercado.id);

    expect(supermercadoEliminado).toBeUndefined();
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid supermarket', async () => {
    await expect(() =>
      service.deleteSupermarketFromCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid city', async () => {
    const supermercado: SupermercadoEntity = listaSupermercados[0];
    await expect(() =>
      service.deleteSupermarketFromCity('0', supermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('deleteSupermarketFromCity should thrown an exception for an non associated supermarket', async () => {
    const nuevoSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.word.noun({ length: 11 }),
        longitud: faker.number.int(),
        latitud: faker.number.int(),
        paginaWeb: faker.internet.url(),
      });

    await expect(() =>
      service.deleteSupermarketFromCity(ciudad.id, nuevoSupermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id is not associated to the city',
    );
  });

  it('addSupermarketToCity should add a supermarket to a city', async () => {
    const nuevoSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.word.noun({ length: 11 }),
        longitud: faker.number.int(),
        latitud: faker.number.int(),
        paginaWeb: faker.internet.url(),
      });

    const nuevaCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: 'Ecuador',
      numeroHabitantes: faker.number.int(),
    });

    const result: CiudadEntity = await service.addSupermarketToCity(
      nuevaCiudad.id,
      nuevoSupermercado.id,
    );

    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(nuevoSupermercado.nombre);
    expect(result.supermercados[0].latitud).toBe(nuevoSupermercado.latitud);
    expect(result.supermercados[0].longitud).toBe(nuevoSupermercado.longitud);
    expect(result.supermercados[0].paginaWeb).toBe(nuevoSupermercado.paginaWeb);
  });

  it('addSupermarketToCity should thrown exception for an invalid supermarket', async () => {
    const nuevaCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: 'Ecuador',
      numeroHabitantes: faker.number.int(),
      supermercados: listaSupermercados,
    });

    await expect(() =>
      service.addSupermarketToCity(nuevaCiudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('addSupermarketToCity should throw an exception for an invalid city', async () => {
    const nuevoSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.word.noun({ length: 11 }),
        longitud: faker.number.int(),
        latitud: faker.number.int(),
        paginaWeb: faker.internet.url(),
      });

    await expect(() =>
      service.addSupermarketToCity('0', nuevoSupermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
});
