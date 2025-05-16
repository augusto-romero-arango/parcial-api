import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RestauranteDto {
  @ApiProperty({ example: 'Restaurante Ejemplo' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Calle 123' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({ example: 'Italiana', description: 'Tipo de cocina' })
  @IsString()
  @IsNotEmpty()
  tipoCocina: string;

  @ApiProperty({ example: 'https://ejemplo.com' })
  @IsString()
  @IsNotEmpty()
  paginaWeb: string;
}