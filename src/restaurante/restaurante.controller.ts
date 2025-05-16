import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { Restaurante } from './restaurante.entity';

@Controller('restaurante')
export class RestauranteController {
  constructor(private readonly restauranteService: RestauranteService) {}

  @Get()
  findAll(): Promise<Restaurante[]> {
    return this.restauranteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Restaurante> {
    return this.restauranteService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Restaurante>): Promise<Restaurante> {
    return this.restauranteService.create(data);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Restaurante>,
  ): Promise<Restaurante> {
    return this.restauranteService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.restauranteService.delete(id);
  }
}
