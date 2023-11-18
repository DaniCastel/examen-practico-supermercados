import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SupermercadoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  longitud: number;

  @IsNumber()
  latitud: number;

  @IsString()
  paginaWeb: string;
}
