import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Plato } from '../plato/plato.entity';

@Entity()
export class Restaurante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @OneToMany(() => Plato, (plato) => plato.restaurante)
  platos: Plato[];
}