import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurante } from '../restaurante/restaurante.entity';
import { Plato } from '../plato/plato.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantePlatoService {
  constructor(
    @InjectRepository(Restaurante)
    private readonly restauranteRepository: Repository<Restaurante>,
    @InjectRepository(Plato)
    private readonly platoRepository: Repository<Plato>,
  ) {}

  async addDishToRestaurant(restauranteId: number, platoId: number): Promise<Restaurante> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante) throw new NotFoundException('Restaurante no encontrado');

    const plato = await this.platoRepository.findOne({ where: { id: platoId } });
    if (!plato) throw new NotFoundException('Plato no encontrado');

    if (restaurante.platos.some(p => p.id === plato.id)) {
      throw new BadRequestException('El plato ya está asociado al restaurante');
    }

    restaurante.platos.push(plato);
    return this.restauranteRepository.save(restaurante);
  }

  async findDishesFromRestaurant(restauranteId: number): Promise<Plato[]> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante) throw new NotFoundException('Restaurante no encontrado');
    return restaurante.platos;
  }

  async findDishFromRestaurant(restauranteId: number, platoId: number): Promise<Plato> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante) throw new NotFoundException('Restaurante no encontrado');
    const plato = restaurante.platos.find(p => p.id === platoId);
    if (!plato) throw new NotFoundException('Plato no asociado a este restaurante');
    return plato;
  }

  async updateDishesFromRestaurant(restauranteId: number, platosIds: number[]): Promise<Restaurante> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante) throw new NotFoundException('Restaurante no encontrado');

    const platos = await this.platoRepository.findByIds(platosIds);
    if (platos.length !== platosIds.length) {
      throw new NotFoundException('Uno o más platos no existen');
    }

    restaurante.platos = platos;
    return this.restauranteRepository.save(restaurante);
  }

  async deleteDishFromRestaurant(restauranteId: number, platoId: number): Promise<void> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante) throw new NotFoundException('Restaurante no encontrado');

    const platoIndex = restaurante.platos.findIndex(p => p.id === platoId);
    if (platoIndex === -1) throw new NotFoundException('Plato no asociado a este restaurante');

    restaurante.platos.splice(platoIndex, 1);
    await this.restauranteRepository.save(restaurante);
  }
}