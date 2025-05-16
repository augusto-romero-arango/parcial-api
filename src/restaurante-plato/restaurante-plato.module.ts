import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurante } from '../restaurante/restaurante.entity';
import { Plato } from '../plato/plato.entity';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { RestaurantePlatoController } from './restaurante-plato.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurante, Plato])],
  providers: [RestaurantePlatoService],
  controllers: [RestaurantePlatoController],
  exports: [RestaurantePlatoService],
})
export class RestaurantePlatoModule {}