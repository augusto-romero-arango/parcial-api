import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Plato } from '../plato/plato.entity';

@Entity()
export class Restaurante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  tipoCocina: string;

  @Column()
  paginaWeb: string;

  @ManyToMany(() => Plato, (plato) => plato.restaurantes)
  @JoinTable()
  platos: Plato[];
}