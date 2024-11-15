import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Between, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { addHour } from '@formkit/tempo';

@Injectable()
export class RoomService {
  constructor (
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    return this.roomRepository.save(createRoomDto);
  }

  async findAll() {
    return this.roomRepository.find();
  }

  async findOne(id: number) {
    return this.roomRepository.findOne({ where: { id } });
  }

  async isAvailable(){
    console.log('aa')
    const room = await this.roomRepository.find()
    const startTime = new Date();
    const endTime = addHour(startTime, 1)
    const rooms = room.map(async (room) => {
      const reservations = await this.reservationRepository.findOne({
        where: [
      {
        room,
        startTime: Between(startTime, endTime),
      },
      {
        room,
        startTime: LessThan(startTime),
        endTime: MoreThan(startTime),
      },
      {
        room,
        startTime: LessThan(endTime),
        endTime: MoreThan(endTime),
      },
      {
        room,
        startTime: LessThanOrEqual(startTime),
        endTime: MoreThanOrEqual(endTime),
      }
    ],
      });
    if(reservations){
      return {room, isAvailable: true}
    }
    return {room, isAvailable: false}
    })
    return rooms;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    return this.roomRepository.update(id, updateRoomDto);
  }

  async remove(id: number) {
    return this.roomRepository.delete(id);
  }
}
