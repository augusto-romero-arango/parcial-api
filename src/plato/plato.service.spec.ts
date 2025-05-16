import { Test, TestingModule } from '@nestjs/testing';
import { PlatoService } from './plato.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Plato } from './plato.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPlato = {
  id: 1,
  nombre: 'Plato Prueba',
  descripcion: 'Descripción de prueba',
  precio: 10000,
  categoria: 'entrada',
  restaurantes: [],
};

describe('PlatoService', () => {
  let service: PlatoService;
  let repo: Repository<Plato>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlatoService,
        {
          provide: getRepositoryToken(Plato),
          useValue: {
            find: jest.fn().mockResolvedValue([mockPlato]),
            findOne: jest.fn().mockImplementation(({ where: { id } }) =>
              id === mockPlato.id ? Promise.resolve(mockPlato) : Promise.resolve(null)
            ),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((plato) => Promise.resolve({ ...mockPlato, ...plato })),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<PlatoService>(PlatoService);
    repo = module.get<Repository<Plato>>(getRepositoryToken(Plato));
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll retorna lista de platos', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockPlato]);
    expect(repo.find).toHaveBeenCalledWith({ relations: ['restaurantes'] });
  });

  it('findOne retorna plato solicitado', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockPlato);
  });

  it('findOne lanza NotFoundException si no existe', async () => {
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('create guarda y retorna plato si datos válidos', async () => {
    const dto = { ...mockPlato, precio: 5000, categoria: 'entrada' };
    const result = await service.create(dto);
    expect(result).toMatchObject(dto);
  });

  it('create lanza BadRequestException si precio no es positivo', async () => {
    const dto = { ...mockPlato, precio: -100, categoria: 'entrada' };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('create lanza BadRequestException si categoría no es válida', async () => {
    const dto = { ...mockPlato, precio: 1000, categoria: 'invalida' };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('update guarda y retorna plato si datos válidos', async () => {
    const dto = { precio: 20000, categoria: 'postre' };
    const result = await service.update(1, dto);
    expect(result.precio).toBe(20000);
    expect(result.categoria).toBe('postre');
  });

  it('update lanza BadRequestException si precio no es positivo', async () => {
    const dto = { precio: 0 };
    await expect(service.update(1, dto)).rejects.toThrow(BadRequestException);
  });

  it('update lanza BadRequestException si categoría no es válida', async () => {
    const dto = { categoria: 'invalida' };
    await expect(service.update(1, dto)).rejects.toThrow(BadRequestException);
  });

  it('delete elimina plato', async () => {
    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(repo.remove).toHaveBeenCalled();
  });
});