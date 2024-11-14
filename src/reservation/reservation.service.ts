import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Between, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { RoomService } from 'src/room/room.service';
import { addHours, addMinutes, isAfter } from 'date-fns';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}
  async create(createReservationDto: CreateReservationDto) {
    const currentTime = new Date();

    const minTimeAllowed = addMinutes(currentTime, 15);
    console.log(minTimeAllowed);
    if (isAfter(minTimeAllowed, createReservationDto.startTime)) {
      throw new Error("La reserva debe hacerse al menos con 15 minutos de anticipación");
    }

    const endTime = addHours(createReservationDto.startTime, 1);

    const user = await this.userService.findOne(createReservationDto.userId);

    const room = await this.roomService.findOne(createReservationDto.roomId);

    if(!user || !room) {
      throw new Error("El usuario o la habitación no existen");
    }

    const overlappingReserva = await this.reservationRepository.findOne({
      where: [
        {room, startTime: Between(createReservationDto.startTime, endTime) }
      ],
    });

    if (overlappingReserva) {
      throw new Error("La habitación ya está reservada en el horario seleccionado");
    }

    delete createReservationDto.userId;
    delete createReservationDto.roomId;
    return this.reservationRepository.save(this.reservationRepository.create({ ...createReservationDto, user, room }));
  }

  findAll() {
    return this.reservationRepository.find();
  }

  findOne(id: number) {
    return this.reservationRepository.findOne({ where: { id } });
  }
}
