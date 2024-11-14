import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { User } from '../user/entities/user.entity';
import { Room } from '../room/entities/room.entity';
import { UserService } from '../user/user.service';
import { RoomService } from '../room/room.service';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, User, Room]),
    UserModule,
    RoomModule,
  ],
  providers: [ReservationService, UserService, RoomService],
  controllers: [ReservationController],
})
export class ReservationModule {}
