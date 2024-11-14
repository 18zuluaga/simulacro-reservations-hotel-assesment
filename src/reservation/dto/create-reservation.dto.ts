import { IsDateString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  @IsPositive({ message: 'El ID del usuario debe ser un número positivo' })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  userId: number;

  @IsInt({ message: 'El ID de la habitación debe ser un número entero' })
  @IsPositive({ message: 'El ID de la habitación debe ser un número positivo' })
  @IsNotEmpty({ message: 'El ID de la habitación es obligatorio' })
  roomId: number;

  @IsDateString({},{ message: 'La fecha y hora de inicio debe ser válida' })
  @IsNotEmpty({ message: 'La fecha y hora de inicio son obligatorias' })
  startTime: Date;
}
