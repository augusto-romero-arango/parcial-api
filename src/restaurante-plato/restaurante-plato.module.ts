import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurante } from '../restaurante/restaurante.entity';
import { Plato } from '../plato/plato.entity';
import { RestaurantePlatoService } from './restaurante-plato.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurante, Plato])],
  providers: [RestaurantePlatoService],
  exports: [RestaurantePlatoService],
})
export class RestaurantePlatoModule {}