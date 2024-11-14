import { IsString, IsNotEmpty, IsOptional,} from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty({ message: 'El número de la habitación es obligatorio.' })
  @IsString({ message: 'El número de la habitación debe ser un texto.' })
  roomNumber: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto.' })
  description: string;

  @IsNotEmpty({ message: 'El nombre de la habitación es obligatorio.' })
  @IsString({ message: 'El nombre de la habitación debe ser un texto.' })
  name: string;
}
