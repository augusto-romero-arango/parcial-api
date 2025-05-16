import { Controller, Post, Get, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { Plato } from '../plato/plato.entity';
import { Restaurante } from '../restaurante/restaurante.entity';

@Controller('restaurants/:restauranteId/dishes')
export class RestaurantePlatoController {
  constructor(private readonly restaurantePlatoService: RestaurantePlatoService) {}

  @Post(':platoId')
  async addDishToRestaurant(
    @Param('restauranteId', ParseIntPipe) restauranteId: number,
    @Param('platoId', ParseIntPipe) platoId: number,
  ): Promise<Restaurante> {
    return this.restaurantePlatoService.addDishToRestaurant(restauranteId, platoId);
  }

  @Get()
  async findDishesFromRestaurant(
    @Param('restauranteId', ParseIntPipe) restauranteId: number,
  ): Promise<Plato[]> {
    return this.restaurantePlatoService.findDishesFromRestaurant(restauranteId);
  }

  @Get(':platoId')
  async findDishFromRestaurant(
    @Param('restauranteId', ParseIntPipe) restauranteId: number,
    @Param('platoId', ParseIntPipe) platoId: number,
  ): Promise<Plato> {
    return this.restaurantePlatoService.findDishFromRestaurant(restauranteId, platoId);
  }

  @Put()
  async updateDishesFromRestaurant(
    @Param('restauranteId', ParseIntPipe) restauranteId: number,
    @Body() platosIds: number[],
  ): Promise<Restaurante> {
    return this.restaurantePlatoService.updateDishesFromRestaurant(restauranteId, platosIds);
  }

  @Delete(':platoId')
  async deleteDishFromRestaurant(
    @Param('restauranteId', ParseIntPipe) restauranteId: number,
    @Param('platoId', ParseIntPipe) platoId: number,
  ): Promise<void> {
    return this.restaurantePlatoService.deleteDishFromRestaurant(restauranteId, platoId);
  }
}