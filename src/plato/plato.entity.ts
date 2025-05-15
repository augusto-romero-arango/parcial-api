import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Restaurante } from '../restaurante/restaurante.entity';

@Entity()
export class Plato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column('decimal')
  precio: number;

  @ManyToOne(() => Restaurante, (restaurante) => restaurante.platos)
  restaurante: Restaurante;
}