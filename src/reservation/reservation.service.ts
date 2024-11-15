import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Between, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { RoomService } from 'src/room/room.service';
import { addHour, addMinute, isAfter, tzDate, format } from '@formkit/tempo';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}
  async create(createReservationDto: CreateReservationDto) {
    createReservationDto.startTime = new Date(createReservationDto.startTime);
    const date = new Date();
    const minTimeAllowed = addMinute(date, 15);
    if (!isAfter(createReservationDto.startTime, minTimeAllowed)) {
      throw new Error(
        'La reserva debe hacerse al menos con 15 minutos de anticipación',
      );
    }

    const endTime = addHour(createReservationDto.startTime, 1)

    const user = await this.userService.findOne(createReservationDto.userId);

    const room = await this.roomService.findOne(createReservationDto.roomId);

    if (!user || !room) {
      throw new Error('El usuario o la habitación no existen');
    }

    const overlappingReserva = await this.reservationRepository.findOne({
      where: [
    {
      room,
      startTime: Between(createReservationDto.startTime, endTime),
    },
    {
      room,
      startTime: LessThan(createReservationDto.startTime),
      endTime: MoreThan(createReservationDto.startTime),
    },
    {
      room,
      startTime: LessThan(endTime),
      endTime: MoreThan(endTime),
    },
    {
      room,
      startTime: LessThanOrEqual(createReservationDto.startTime),
      endTime: MoreThanOrEqual(endTime),
    }
  ],
    });

    if (overlappingReserva) {
      throw new Error(
        'La habitación ya está reservada en el horario seleccionado',
      );
    }

    delete createReservationDto.userId;
    delete createReservationDto.roomId;
    return this.reservationRepository.save(
      this.reservationRepository.create({
        ...createReservationDto,
        user,
        room,
        endTime
      }),
    );
  }

  findAll() {
    return this.reservationRepository.find();
  }

  findOne(id: number) {
    return this.reservationRepository.findOne({ where: { id } });
  }

}
