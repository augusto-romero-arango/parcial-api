import { Test, TestingModule } from '@nestjs/testing';
import { RestauranteService } from './restaurante.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Restaurante } from './restaurante.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockRestaurante = {
  id: 1,
  nombre: 'Restaurante Prueba',
  direccion: 'Calle 123',
  tipoCocina: 'Italiana',
  paginaWeb: 'http://prueba.com',
  platos: [],
};

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repo: Repository<Restaurante>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestauranteService,
        {
          provide: getRepositoryToken(Restaurante),
          useValue: {
            find: jest.fn().mockResolvedValue([mockRestaurante]),
            findOne: jest.fn().mockImplementation(({ where: { id } }) =>
              id === mockRestaurante.id ? Promise.resolve(mockRestaurante) : Promise.resolve(null)
            ),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((restaurante) => Promise.resolve({ ...mockRestaurante, ...restaurante })),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repo = module.get<Repository<Restaurante>>(getRepositoryToken(Restaurante));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll retorna lista de restaurantes', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockRestaurante]);
    expect(repo.find).toHaveBeenCalledWith({ relations: ['platos'] });
  });

  it('findOne retorna restaurante solicitado', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockRestaurante);
  });

  it('findOne lanza error notFound si no lo encuentra', async () => {
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('create con tipoCocina valido crea el restaurante', async () => {
    const dto = { ...mockRestaurante, tipoCocina: 'Italiana' };
    const result = await service.create(dto);
    expect(result).toMatchObject(dto);
  });

  it('create con tipoCocina inválido lanza BadRequest', async () => {
    const dto = { ...mockRestaurante, tipoCocina: 'Francesa' };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('update con tipoCocina valido actualiza el restaurante', async () => {
    const dto = { tipoCocina: 'Japonesa' };
    const result = await service.update(1, dto);
    expect(result.tipoCocina).toBe('Japonesa');
  });

  it('update con tipoCocina invalido lanza BadRequest', async () => {
    const dto = { tipoCocina: 'Francesa' };
    await expect(service.update(1, dto)).rejects.toThrow(BadRequestException);
  });

  it('delete elimna restaurante', async () => {
    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(repo.remove).toHaveBeenCalled();
  });
});