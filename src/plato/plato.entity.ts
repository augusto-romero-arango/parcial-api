import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
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

  @Column()
  categoria: string; // entrada, plato fuerte, postre, bebida

  @ManyToMany(() => Restaurante, (restaurante) => restaurante.platos)
  restaurantes: Restaurante[];
}