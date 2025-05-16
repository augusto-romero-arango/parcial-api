import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurante } from './restaurante.entity';
import { Repository } from 'typeorm';

const TIPOS_COCINA = [
  'Italiana',
  'Japonesa',
  'Mexicana',
  'Colombiana',
  'India',
  'Internacional',
];

@Injectable()
export class RestauranteService {
  constructor(
    @InjectRepository(Restaurante)
    private readonly restauranteRepository: Repository<Restaurante>,
  ) {}

  async findAll(): Promise<Restaurante[]> {
    return this.restauranteRepository.find({ relations: ['platos'] });
  }

  async findOne(id: number): Promise<Restaurante> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id },
      relations: ['platos'],
    });
    if (!restaurante) {
      throw new NotFoundException('Restaurante no encontrado');
    }
    return restaurante;
  }

  async create(data: Partial<Restaurante>): Promise<Restaurante> {
    if (!data.tipoCocina || !TIPOS_COCINA.includes(data.tipoCocina)) {
      throw new BadRequestException('Tipo de cocina inválido');
    }
    const restaurante = this.restauranteRepository.create(data);
    return this.restauranteRepository.save(restaurante);
  }

  async update(id: number, data: Partial<Restaurante>): Promise<Restaurante> {
    const restaurante = await this.findOne(id);
    if (data.tipoCocina && !TIPOS_COCINA.includes(data.tipoCocina)) {
      throw new BadRequestException('Tipo de cocina inválido');
    }
    Object.assign(restaurante, data);
    return this.restauranteRepository.save(restaurante);
  }

  async delete(id: number): Promise<void> {
    const restaurante = await this.findOne(id);
    await this.restauranteRepository.remove(restaurante);
  }
}