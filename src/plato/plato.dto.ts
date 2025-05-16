import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PlatoDto {
  @ApiProperty({ example: 'Pizza Margherita' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Pizza tradicional italiana con tomate y mozzarella' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @Min(1)
  precio: number;

  @ApiProperty({ example: 'entrada', description: 'Categoría: entrada, plato fuerte, postre, bebida' })
  @IsString()
  @IsNotEmpty()
  categoria: string;
}