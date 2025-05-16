import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plato } from './plato.entity';
import { PlatoService } from './plato.service';
import { PlatoController } from './plato.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Plato])],
  providers: [PlatoService],
  controllers: [PlatoController],
  exports: [PlatoService],
})
export class PlatoModule {}