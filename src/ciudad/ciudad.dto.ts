import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CiudadDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsNumber()
  numeroHabitantes: number;
}
