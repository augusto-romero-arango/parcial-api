import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Restaurante } from '../restaurante/restaurante.entity';
import { Plato } from '../plato/plato.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockPlato = { id: 1, nombre: 'Plato', descripcion: '', precio: 1000, categoria: 'entrada', restaurantes: [] };
const mockRestaurante = { id: 1, nombre: 'Restaurante', direccion: '', tipoCocina: 'Italiana', paginaWeb: '', platos: [] };

describe('RestaurantePlatoService', () => {
  let service: RestaurantePlatoService;
  let restauranteRepo: Repository<Restaurante>;
  let platoRepo: Repository<Plato>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantePlatoService,
        {
          provide: getRepositoryToken(Restaurante),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Plato),
          useValue: {
            findOne: jest.fn(),
            findByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantePlatoService>(RestaurantePlatoService);
    restauranteRepo = module.get<Repository<Restaurante>>(getRepositoryToken(Restaurante));
    platoRepo = module.get<Repository<Plato>>(getRepositoryToken(Plato));
  });

  it('addDishToRestaurant asocia un plato a un restaurante', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({ ...mockRestaurante, platos: [] } as any);
    jest.spyOn(platoRepo, 'findOne').mockResolvedValueOnce(mockPlato as any);
    jest.spyOn(restauranteRepo, 'save').mockResolvedValueOnce({ ...mockRestaurante, platos: [mockPlato] } as any);

    const result = await service.addDishToRestaurant(1, 1);
    expect(result.platos).toContainEqual(mockPlato);
  });

  it('addDishToRestaurant lanza NotFoundException si restaurante no existe', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.addDishToRestaurant(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('addDishToRestaurant lanza NotFoundException si plato no existe', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({ ...mockRestaurante, platos: [] } as any);
    jest.spyOn(platoRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.addDishToRestaurant(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('addDishToRestaurant lanza BadRequestException si el plato ya está asociado', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({ ...mockRestaurante, platos: [mockPlato] } as any);
    jest.spyOn(platoRepo, 'findOne').mockResolvedValueOnce(mockPlato as any);
    await expect(service.addDishToRestaurant(1, 1)).rejects.toThrow(BadRequestException);
  });

  it('findDishesFromRestaurant retorna los platos asociados', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({ ...mockRestaurante, platos: [mockPlato] } as any);
    const result = await service.findDishesFromRestaurant(1);
    expect(result).toEqual([mockPlato]);
  });

  it('findDishesFromRestaurant lanza NotFoundException si restaurante no existe', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findDishesFromRestaurant(1)).rejects.toThrow(NotFoundException);
  });

  it('findDishFromRestaurant retorna el plato asociado', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({ ...mockRestaurante, platos: [mockPlato] } as any);
    const result = await service.findDishFromRestaurant(1, 1);
    expect(result).toEqual(mockPlato);
  });

  it('findDishFromRestaurant lanza NotFoundException si restaurante no existe', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findDishFromRestaurant(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('findDishFromRestaurant lanza NotFoundException si el plato no está asociado', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({ ...mockRestaurante, platos: [] } as any);
    await expect(service.findDishFromRestaurant(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('updateDishesFromRestaurant actualiza los platos asociados', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({ ...mockRestaurante, platos: [] } as any);
    jest.spyOn(platoRepo, 'findByIds').mockResolvedValueOnce([mockPlato] as any);
    jest.spyOn(restauranteRepo, 'save').mockResolvedValueOnce({ ...mockRestaurante, platos: [mockPlato] } as any);

    const result = await service.updateDishesFromRestaurant(1, [1]);
    expect(result.platos).toEqual([mockPlato]);
  });

  it('updateDishesFromRestaurant lanza NotFoundException si restaurante no existe', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.updateDishesFromRestaurant(1, [1])).rejects.toThrow(NotFoundException);
  });

  it('updateDishesFromRestaurant lanza NotFoundException si algún plato no existe', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({ ...mockRestaurante, platos: [] } as any);
    jest.spyOn(platoRepo, 'findByIds').mockResolvedValueOnce([]);
    await expect(service.updateDishesFromRestaurant(1, [1])).rejects.toThrow(NotFoundException);
  });

  it('deleteDishFromRestaurant elimina el plato asociado', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({ ...mockRestaurante, platos: [mockPlato] } as any);
    jest.spyOn(restauranteRepo, 'save').mockResolvedValueOnce({ ...mockRestaurante, platos: [] } as any);

    await expect(service.deleteDishFromRestaurant(1, 1)).resolves.toBeUndefined();
  });

  it('deleteDishFromRestaurant lanza NotFoundException si restaurante no existe', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.deleteDishFromRestaurant(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('deleteDishFromRestaurant lanza NotFoundException si el plato no está asociado', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({ ...mockRestaurante, platos: [] } as any);
    await expect(service.deleteDishFromRestaurant(1, 1)).rejects.toThrow(NotFoundException);
  });
});