import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PlatoService } from './plato.service';
import { Plato } from './plato.entity';
import { PlatoDto } from './plato.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('dishes')
export class PlatoController {
  constructor(private readonly platoService: PlatoService) {}

  @Get()
  findAll(): Promise<Plato[]> {
    return this.platoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Plato> {
    return this.platoService.findOne(id);
  }

  @Post()
  @ApiBody({ type: PlatoDto })
  create(@Body() data: PlatoDto): Promise<Plato> {
    return this.platoService.create(data);
  }

  @Put(':id')
  @ApiBody({ type: PlatoDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PlatoDto,
  ): Promise<Plato> {
    return this.platoService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.platoService.delete(id);
  }
}
