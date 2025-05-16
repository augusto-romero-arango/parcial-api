import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { Restaurante } from './restaurante.entity';
import { RestauranteDto } from './restaurante.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('restaurants')
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
  @ApiBody({ type: RestauranteDto })
  create(@Body() data: RestauranteDto): Promise<Restaurante> {
    return this.restauranteService.create(data);
  }

  @Put(':id')
  @ApiBody({ type: RestauranteDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: RestauranteDto,
  ): Promise<Restaurante> {
    return this.restauranteService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.restauranteService.delete(id);
  }
}
