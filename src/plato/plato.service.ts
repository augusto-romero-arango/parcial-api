import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plato } from './plato.entity';
import { Repository } from 'typeorm';

const CATEGORIAS_VALIDAS = ['entrada', 'plato fuerte', 'postre', 'bebida'];

@Injectable()
export class PlatoService {
  constructor(
    @InjectRepository(Plato)
    private readonly platoRepository: Repository<Plato>,
  ) {}

  async findAll(): Promise<Plato[]> {
    return this.platoRepository.find({ relations: ['restaurantes'] });
  }

  async findOne(id: number): Promise<Plato> {
    const plato = await this.platoRepository.findOne({
      where: { id },
      relations: ['restaurantes'],
    });
    if (!plato) {
      throw new NotFoundException('Plato no encontrado');
    }
    return plato;
  }

  async create(data: Partial<Plato>): Promise<Plato> {
    if (typeof data.precio !== 'number' || data.precio <= 0) {
      throw new BadRequestException('El precio debe ser un número positivo');
    }
    if (typeof data.categoria !== 'string' || !CATEGORIAS_VALIDAS.includes(data.categoria)) {
      throw new BadRequestException('Categoría inválida');
    }
    const plato = this.platoRepository.create(data);
    return this.platoRepository.save(plato);
  }

  async update(id: number, data: Partial<Plato>): Promise<Plato> {
    const plato = await this.findOne(id);
    if (data.precio !== undefined && (typeof data.precio !== 'number' || data.precio <= 0)) {
      throw new BadRequestException('El precio debe ser un número positivo');
    }
    if (data.categoria && !CATEGORIAS_VALIDAS.includes(data.categoria)) {
      throw new BadRequestException('Categoría inválida');
    }
    Object.assign(plato, data);
    return this.platoRepository.save(plato);
  }

  async delete(id: number): Promise<void> {
    const plato = await this.findOne(id);
    await this.platoRepository.remove(plato);
  }
}