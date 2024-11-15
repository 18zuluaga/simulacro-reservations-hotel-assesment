import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { RoomGateway } from './room.gateway';

@Module({
  imports : [TypeOrmModule.forFeature([Room, Reservation])],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
})
export class RoomModule {}
