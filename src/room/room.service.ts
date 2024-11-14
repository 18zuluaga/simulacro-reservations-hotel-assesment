import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor (
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
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

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    return this.roomRepository.update(id, updateRoomDto);
  }

  async remove(id: number) {
    return this.roomRepository.delete(id);
  }
}
